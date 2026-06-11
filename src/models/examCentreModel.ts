import { model, Schema, Types } from "mongoose";

interface IExamCentre {
  cbtExamination: Types.ObjectId;
  centre: Types.ObjectId;
  downloadTime: Date;
  totalCandidates: number;
  sessions: [ISessionDetail];
  capacity: number;
}

interface ISessionDetail {
  examSession: Types.ObjectId;
  timeDownloaded: Date;
  timeUploaded: Date;
  timeActivated: Date;
  timeEnded: Date;
  candidates: number;
  started: number;
  submitted: number;
}

const SessionDetail = new Schema<ISessionDetail>({
  examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
  timeDownloaded: Date,
  timeUploaded: Date,
  timeActivated: Date,
  timeEnded: Date,
  candidates: { type: Number, default: 0 },
  started: { type: Number, default: 0 },
  submitted: { type: Number, default: 0 },
});

const schema = new Schema<IExamCentre>(
  {
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
    downloadTime: Date,
    totalCandidates: { type: Number, default: 0 },
    sessions: [{ type: SessionDetail }],
    capacity: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Virtual status field
schema.virtual("status").get(function (this: any) {
  const hasUploaded = this.sessions?.some(
    (s: ISessionDetail) => s.timeUploaded != null,
  );

  if (hasUploaded) return "uploaded";

  const lastUpdate = this.updatedAt?.getTime() ?? 0;
  const now = Date.now();
  const diffInMinutes = (now - lastUpdate) / (1000 * 60);

  if (diffInMinutes <= 2) return "online";

  return "offline";
});

// Include virtuals
schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

schema.index({ cbtExamination: 1, centre: 1 }, { unique: true });

const ExamCentreModel = model("ExamCentre", schema);

export default ExamCentreModel;
