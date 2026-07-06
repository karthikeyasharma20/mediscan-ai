import axios from "axios";

export async function analyzeMedicalReport(report) {

    const response = await axios.post(

        "http://localhost:5000/api/analyze",

        {
            report
        }

    );

    return JSON.parse(response.data.answer);

}