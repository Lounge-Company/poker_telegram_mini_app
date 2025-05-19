export function registerHandlers(instance: any, room: any) {
  const prototype = Object.getPrototypeOf(instance)
  if (prototype.__messageHandlers) {
    for (const { eventName, method } of prototype.__messageHandlers) {
      room.onMessage(eventName, instance[method].bind(instance))
    }
  }
}

export function onMessage(eventName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (!target.__messageHandlers) {
      target.__messageHandlers = []
    }
    target.__messageHandlers.push({ eventName, method: propertyKey })
  }
}
