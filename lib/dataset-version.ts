export interface DatasetVersion {
  schemaVersion: string;
  editorialVersion: string;
  officialSnapshotId: string;
  generatedAt: string;
}

export const currentDatasetVersion: DatasetVersion = {
  schemaVersion: "1.0.0",
  editorialVersion: "1.0.0",
  officialSnapshotId: "bundled-mma-2026-08-06",
  generatedAt: "2026-08-06T13:41:50.986Z",
};

export const recommendationAlgorithmVersion = "1.0.0";
