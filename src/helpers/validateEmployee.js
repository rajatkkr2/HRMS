/**
 * Validates employee input fields before saving to DB
 * @param {Object} body - Request body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateEmployee = (body) => {
  const errors = [];
  const { name, experience, stack, designation, salary } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name is required and must be at least 2 characters");
  }

  if (experience === undefined || experience === null || isNaN(experience) || Number(experience) < 0) {
    errors.push("Experience is required and must be a non-negative number");
  }

  if (!stack || typeof stack !== "string" || stack.trim().length === 0) {
    errors.push("Stack is required");
  }

  if (!designation || typeof designation !== "string" || designation.trim().length === 0) {
    errors.push("Designation is required");
  }

  if (salary === undefined || salary === null || isNaN(salary) || Number(salary) < 0) {
    errors.push("Salary is required and must be a non-negative number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = validateEmployee;
