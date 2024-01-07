import express from "express";

export interface IRESPONSE {
  result?: any;
  statusCode?: number;
  statusMessage?: string;
  errorMessage?: string;
  resRef: express.Response;
  hasError: boolean;
}
