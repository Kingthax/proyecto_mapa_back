const healthCheck = (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
  };
  
  module.exports = { healthCheck };