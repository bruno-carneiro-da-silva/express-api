import { RequestHandler } from "express";
import PlanRepository from "../repositories/PlanRepository";

export const createPlan: RequestHandler = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const plan = await PlanRepository.createPlan(name, description, price);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar plano" });
  }
};

export const addFeatureToPlan: RequestHandler = async (req, res) => {
  try {
    const { planId, featureName, featureDescription } = req.body;
    const feature = await PlanRepository.addFeatureToPlan(
      planId,
      featureName,
      featureDescription
    );
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar recurso ao plano" });
  }
};

export const addPriceToPlan: RequestHandler = async (req, res) => {
  try {
    const { planId, priceName, priceValue, benefits } = req.body;
    const price = await PlanRepository.addPriceToPlan(
      planId,
      priceName,
      priceValue,
      benefits
    );
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar preço ao plano" });
  }
};
