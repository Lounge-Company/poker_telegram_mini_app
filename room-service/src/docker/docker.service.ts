import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import * as Docker from 'dockerode';

@Injectable()
export class DockerService implements OnModuleInit, OnApplicationShutdown {
  private docker: Docker;

  onModuleInit() {
    this.docker = new Docker();
  }

  async onApplicationShutdown() {
    console.log('Application shutting down, stopping all containers...');
    try {
      await this.stopAllContainers();
      console.log('All containers stopped');
    } catch (e) {
      console.error('Error stopping containers on shutdown:', e);
    }
  }

  async startContainer(port: number): Promise<string> {
    const containerName = `colyseus-room-${port}`;
    const roomPath = `/room${port}`; // например, /room2567

    const containers = await this.docker.listContainers({ all: true });
    const existing = containers.find((c) =>
      c.Names.includes(`/${containerName}`),
    );

    if (existing) {
      const container = this.docker.getContainer(existing.Id);
      try {
        if (existing.State === 'running') {
          await container.stop();
        }
        await container.remove();
        console.log(`Removed existing container ${containerName}`);
      } catch (e) {
        console.error(
          `Failed to remove existing container ${containerName}:`,
          e,
        );
        throw e;
      }
    }

    const container = await this.docker.createContainer({
      Image: 'colyseus-server-image',
      name: containerName,
      ExposedPorts: {
        '2567/tcp': {},
      },
      HostConfig: {
        PortBindings: {
          '2567/tcp': [{ HostPort: port.toString() }],
        },
      },
      Labels: {
        // Маршрутизируем путь /room123 на этот контейнер
        [`traefik.http.routers.${containerName}.rule`]: `PathPrefix(\`${roomPath}\`)`,
        [`traefik.http.services.${containerName}.loadbalancer.server.port`]:
          '2567',

        // Добавляем middleware, который убирает префикс /room123 из пути при проксировании
        [`traefik.http.middlewares.strip-${containerName}.stripprefix.prefixes`]:
          roomPath,
        [`traefik.http.routers.${containerName}.middlewares`]: `strip-${containerName}`,
      },
      NetworkingConfig: {
        EndpointsConfig: {
          'traefik-net': {},
        },
      },
    });

    await container.start();
    console.log(`Started container ${containerName} at /room${port}`);
    return container.id;
  }

  async stopContainer(containerId: string): Promise<void> {
    const container = this.docker.getContainer(containerId);
    await container.stop();
    await container.remove();
  }

  async stopAllContainers() {
    const containers = await this.docker.listContainers({ all: true });

    for (const containerInfo of containers) {
      const container = this.docker.getContainer(containerInfo.Id);
      try {
        if (containerInfo.State === 'running') {
          await Promise.race([
            container.stop(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Stop timeout')), 5000),
            ),
          ]);
          console.log(`Stopped container ${containerInfo.Id}`);
        }
      } catch (error) {
        console.warn(
          `Failed to stop container ${containerInfo.Id}:`,
          error.message,
        );
      }
    }
  }

  async listContainers(): Promise<Docker.ContainerInfo[]> {
    return this.docker.listContainers({ all: true });
  }
}
