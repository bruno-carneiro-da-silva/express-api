interface Plan {
    name: string;
    price: number;
    features: string[];
}

const plans: Plan[] = [
    {
        name: "Basic",
        price: 9.99,
        features: ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
        name: "Standard",
        price: 19.99,
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
    },
    {
        name: "Premium",
        price: 29.99,
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]
    }
];

console.log(plans);