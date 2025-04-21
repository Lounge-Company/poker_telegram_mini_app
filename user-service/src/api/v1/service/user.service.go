package service

import (
	"database/sql"
	"errors"
	"user-service/src/api/v1/model"
)

type UserService struct {
    DB *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
    return &UserService{DB: db}
}

func (s *UserService) GetAll() ([]model.User, error) {
    rows, err := s.DB.Query("SELECT id, name FROM users")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []model.User
    for rows.Next() {
        var u model.User
        if err := rows.Scan(&u.ID, &u.Name); err != nil {
            return nil, err
        }
        users = append(users, u)
    }
    return users, nil
}

func (s *UserService) GetByID(id int) (*model.User, error) {
    var u model.User
    err := s.DB.QueryRow("SELECT id, name FROM users WHERE id=$1", id).Scan(&u.ID, &u.Name)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, errors.New("user not found")
        }
        return nil, err
    }
    return &u, nil
}

func (s *UserService) Create(user *model.User) (*model.User, error) {
    err := s.DB.QueryRow("INSERT INTO users(name) VALUES($1) RETURNING id", user.Name).Scan(&user.ID)
    if err != nil {
        return nil, err
    }
    return user, nil
}

func (s *UserService) Update(user *model.User) (*model.User, error) {
    res, err := s.DB.Exec("UPDATE users SET name=$1 WHERE id=$2", user.Name, user.ID)
    if err != nil {
        return nil, err
    }
    affected, _ := res.RowsAffected()
    if affected == 0 {
        return nil, errors.New("user not found")
    }
    return user, nil
}

func (s *UserService) Delete(id int) error {
    res, err := s.DB.Exec("DELETE FROM users WHERE id=$1", id)
    if err != nil {
        return err
    }
    affected, _ := res.RowsAffected()
    if affected == 0 {
        return errors.New("user not found")
    }
    return nil
}