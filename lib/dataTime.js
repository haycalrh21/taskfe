import moment from "moment";
import "moment/locale/id";

moment.locale("id");

export const formatDate = (dateString) => {
  if (!dateString) {
    console.error("Invalid date input:", dateString);
    return "Tanggal tidak valid";
  }

  try {
    return moment(dateString).format("DD MMMM YYYY");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Tanggal tidak valid";
  }
};
