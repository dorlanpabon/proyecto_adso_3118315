CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('coordinador', 'instructor', 'aprendiz') NOT NULL DEFAULT 'aprendiz',
  status ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_unique (username),
  UNIQUE KEY users_email_unique (email),
  KEY users_role_index (role),
  KEY users_status_index (status)
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(120) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) NULL;

UPDATE users SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL;
UPDATE users SET password_hash = password WHERE password_hash IS NULL AND password IS NOT NULL;
UPDATE users SET status = CASE WHEN is_active = 1 THEN 'activo' ELSE 'inactivo' END WHERE status IS NULL;

ALTER TABLE users MODIFY COLUMN role VARCHAR(30) NOT NULL DEFAULT 'aprendiz';

UPDATE users
SET role = CASE role
  WHEN 'admin' THEN 'coordinador'
  WHEN 'coordinator' THEN 'coordinador'
  WHEN 'instructor' THEN 'instructor'
  WHEN 'apprentice' THEN 'aprendiz'
  ELSE role
END;

UPDATE users SET role = 'aprendiz' WHERE role NOT IN ('coordinador', 'instructor', 'aprendiz');
UPDATE users SET status = 'activo' WHERE status NOT IN ('activo', 'inactivo') OR status IS NULL;

ALTER TABLE users MODIFY COLUMN username VARCHAR(80) NOT NULL;
ALTER TABLE users MODIFY COLUMN name VARCHAR(120) NOT NULL;
ALTER TABLE users MODIFY COLUMN email VARCHAR(160) NOT NULL;
ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NOT NULL;
ALTER TABLE users MODIFY COLUMN role ENUM('coordinador', 'instructor', 'aprendiz') NOT NULL DEFAULT 'aprendiz';
ALTER TABLE users MODIFY COLUMN status ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo';

CREATE INDEX IF NOT EXISTS users_role_index ON users (role);
CREATE INDEX IF NOT EXISTS users_status_index ON users (status);
