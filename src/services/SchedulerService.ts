import toast from "react-hot-toast";
import {GetSchedulerDto} from "./GetSchedulerDto.ts";
import {AdequateLaunch, SchedulerDto} from "./SchedulerDto.ts";

export const postFormData = async (data: GetSchedulerDto): Promise<AdequateLaunch[] | null> => {
  try {
    const response = await fetch("https://server-production-7795.up.railway.app/v01/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`Error: ${errorData.message || "Failed to submit data"}`);
    } else {
      const result: SchedulerDto = await response.json();
      console.log("Success:", result);
      return result.adequete_launches;
    }
  } catch (error) {
    console.error("Network error:", error);
  }

  return null;
};
