// Pastebin (mirrored so Firestore data is type-safe)

export interface EHRResourceIdentifier {
    key: string;
    uid: string;
    patientId: string;
  }
  
  export enum ProcessingState {
    PROCESSING_STATE_UNSPECIFIED = "PROCESSING_STATE_UNSPECIFIED",
    PROCESSING_STATE_NOT_STARTED = "PROCESSING_STATE_NOT_STARTED",
    PROCESSING_STATE_PROCESSING = "PROCESSING_STATE_PROCESSING",
    PROCESSING_STATE_COMPLETED = "PROCESSING_STATE_COMPLETED",
    PROCESSING_STATE_FAILED = "PROCESSING_STATE_FAILED",
  }
  
  export enum FHIRVersion {
    FHIR_VERSION_UNSPECIFIED = "FHIR_VERSION_UNSPECIFIED",
    FHIR_VERSION_R4 = "FHIR_VERSION_R4",
    FHIR_VERSION_R4B = "FHIR_VERSION_R4B",
  }
  
  export interface EHRResourceMetadata {
    state: ProcessingState;
    createdTime: string;      // ISO string
    fetchTime: string;        // ISO string
    processedTime?: string;   // ISO string, optional as it may not be processed yet
    identifier: EHRResourceIdentifier;
    resourceType: string;
    version: FHIRVersion;
  }
  
  export interface EHRResourceJson {
    metadata: EHRResourceMetadata;
    humanReadableStr: string;
    aiSummary?: string;
  }
  
  export interface ResourceWrapper {
    resource: EHRResourceJson;
  }
  
  // Flattened view model for the table, only  what what the UI actually needs
  
  export type FlatRow = {
    id: string;               // Firestore doc id
    resourceType: string;
    createdTime: string;      // ISO
    fetchTime: string;        // ISO
    processedTime: string;    //ISO
    humanReadableStr?: string;
    aiSummary?: string;
    state?: string //processed State
    version?: string //FHIR version
  };