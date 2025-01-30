import { useState, useEffect } from "react";

interface DistrictData {
  district: string;
  areas: string[];
}

export function useDistrictsData() {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [district, setDistrict] = useState("all");
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
    )
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  useEffect(() => {
    if (district && district !== "all") {
      const selectedDistrict = districts.find(
        (d) => d.district.toLowerCase() === district.toLowerCase()
      );
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
  }, [district, districts]);

  return { districts, availableAreas, district, setDistrict };
}
