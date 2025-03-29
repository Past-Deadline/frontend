import toast from "react-hot-toast";

export const postFormData = async (data: any) => {
  try {
    const response = await fetch("https://server-production-7795.up.railway.app/api/v01/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`Error: ${errorData.message || "Failed to submit data"}`);
    } else {
      const result = await response.json();
      console.log("Success:", result);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
