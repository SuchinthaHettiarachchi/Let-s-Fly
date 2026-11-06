/** Rental fleet for the Rentals page. */

export type VehicleType = "cars" | "suvs" | "vans" | "bikes";
export type DriveMode = "self-drive" | "with-driver";

export type Vehicle = {
  id: string;
  name: string;
  type: VehicleType;
  seats: number;
  transmission: "Auto" | "Manual";
  fuel: "Hybrid" | "Diesel" | "Petrol";
  modes: DriveMode[];
  image?: string;
};

export const vehicleTypes: { id: VehicleType; label: string; icon: string }[] = [
  { id: "cars", label: "Cars", icon: "directions_car" },
  { id: "suvs", label: "SUVs", icon: "directions_car" },
  { id: "vans", label: "Vans", icon: "airport_shuttle" },
  { id: "bikes", label: "Bikes", icon: "two_wheeler" },
];

export const vehicles: Vehicle[] = [
  { id: "toyota-axio", name: "Toyota Axio Hybrid", type: "cars", seats: 4, transmission: "Auto", fuel: "Hybrid", modes: ["self-drive", "with-driver"] },
  { id: "honda-vezel", name: "Honda Vezel", type: "cars", seats: 5, transmission: "Auto", fuel: "Hybrid", modes: ["self-drive", "with-driver"], image: "/images/rentals/car.jpg" },
  { id: "land-cruiser", name: "Toyota Land Cruiser", type: "suvs", seats: 7, transmission: "Auto", fuel: "Diesel", modes: ["self-drive", "with-driver"] },
  { id: "toyota-kdh", name: "Toyota KDH High-roof", type: "vans", seats: 12, transmission: "Manual", fuel: "Diesel", modes: ["self-drive", "with-driver"], image: "/images/rentals/van.jpg" },
  { id: "royal-enfield", name: "Royal Enfield Classic", type: "bikes", seats: 2, transmission: "Manual", fuel: "Petrol", modes: ["self-drive"], image: "/images/rentals/bike.jpg" },
  { id: "honda-dio", name: "Honda Dio Scooter", type: "bikes", seats: 2, transmission: "Auto", fuel: "Petrol", modes: ["self-drive"], image: "/images/rentals/scooter.jpg" },
];

export const rentalEssentials = [
  { icon: "badge", title: "Driving licence", text: "Sri Lankan or international permit with AA endorsement." },
  { icon: "verified_user", title: "Fully insured", text: "Comprehensive cover and 24/7 roadside assistance." },
  { icon: "local_shipping", title: "Free delivery", text: "To Colombo hotels and BIA airport at no charge." },
  { icon: "account_balance_wallet", title: "Refundable deposit", text: "Returned in full within 48 hours of drop-off." },
];
