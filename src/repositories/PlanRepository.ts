import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class PlanRepository {
  async createPlan(name: string, description: string, price: number) {
    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price,
      },
    });
    return plan;
  }

  async addFeatureToPlan(
    planId: string,
    featureName: string,
    featureDescription: string
  ) {
    const feature = await prisma.feature.create({
      data: {
        name: featureName,
        description: featureDescription,
        planId,
      },
    });
    return feature;
  }

  async addPriceToPlan(
    planId: string,
    priceName: string,
    priceValue: number,
    benefits: string
  ) {
    const price = await prisma.price.create({
      data: {
        name: priceName,
        price: priceValue,
        benefits,
        planId,
      },
    });
    return price;
  }

  async getPlanById(planId: string) {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { features: true, prices: true },
    });
    return plan;
  }
}

export default new PlanRepository();
