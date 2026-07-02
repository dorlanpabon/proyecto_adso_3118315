function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
}

function isValidRole(role) {
  return ['coordinador', 'instructor', 'aprendiz'].includes(role);
}

function isValidStatus(status) {
  return ['activo', 'inactivo'].includes(status);
}

module.exports = {
  sanitizeUser,
  isValidRole,
  isValidStatus
};
