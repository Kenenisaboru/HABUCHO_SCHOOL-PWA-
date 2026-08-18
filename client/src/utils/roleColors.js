export const roleGradients = {
  admin: "from-violet-500 to-purple-600",
  teacher: "from-blue-500 to-cyan-600",
  student: "from-emerald-500 to-teal-600",
};

export const getRoleGradient = (role) => roleGradients[role] || roleGradients.student;
