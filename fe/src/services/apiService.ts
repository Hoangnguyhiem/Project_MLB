import axios from 'axios';

const apiService = {
  // createProduct: async (productData: any) => {
  //   const response = await axios.post('/api/products', productData);
  //   return response.data;
  // },
  updateProduct: async (productData: any) => {
    const response = await axios.put(`http://localhost:8080/api/carts/update`, productData);
    return response.data;
  },
  deleteProduct: async (data: any) => {
    const response = await axios.post(`http://localhost:8080/api/carts/remove`, data);
    return response.data;
  },
  // Thêm các thao tác khác nếu cần
};

export default apiService;