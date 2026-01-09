// Payments integration removed. These stubs avoid import errors and do not use
// any external payment SDK or environment variables.

export const createOrder = async (req, res) => {
  res.status(410).json({ success: false, message: "Payments are currently disabled." });
};

export const verifyPayment = async (req, res) => {
  res.status(410).json({ success: false, message: "Payments are currently disabled." });
};

export const webhook = async (req, res) => {
  res.status(410).json({ success: false, message: "Payments are currently disabled." });
};
