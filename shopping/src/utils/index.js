module.exports.PublishCustomerEvent = async (payload) => {
  axios.post('http://localhost:8000/customer/app-events', {
    payload
  });

}


module.exports.PublishProductEvent = async (payload) => {
    axios.post('http://localhost:8000/products/app-events', {
    payload
  });

}