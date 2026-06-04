import { Request } from "express";
import { Schema, model } from "mongoose";

export interface ICandidate {
  examinationNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: Date;
  gender: string;
  stateOfOrigin: string;
  lga: string;
  address: string;
  email: string;
  phone: string;
  photo: string;
  signature: string;
  status: string;
  centreId: string;
  centreName: string;
  centreAddress: string;
}
