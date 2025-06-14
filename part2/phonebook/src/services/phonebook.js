import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  return axios
    .get(baseUrl)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Error in getAll:", error);
      throw error;
    });
};

const create = (personObject) => {
  return axios
    .post(baseUrl, personObject)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating person:", error);
      throw error;
    });
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).catch((error) => {
    console.error("Error deleting person:", error);
    throw error;
  });
};

const update = (id, updatedPerson) => {
  return axios
    .put(`${baseUrl}/${id}`, updatedPerson)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating person:", error);
      throw error;
    });
};

export default {
  getAll,
  create,
  remove,
  update,
};
