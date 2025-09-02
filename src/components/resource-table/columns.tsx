"use client";
import { ColumnDef } from "@tanstack/react-table";
import { FlatRow } from "../../types/resource";
import { relative } from "../../lib/time";
import { Badge } from "../ui/badge";

// Column definitions for the resource table
export const columns: ColumnDef<FlatRow>[] = [
  { header: "Resource Type", accessorKey: "resourceType" },
  {   // Processing state shown as a badge (Completed, Pending, Failed, etc.)
    accessorKey: "state",
    header: "Processing State",
    cell: ({ row }) => {
      const value = row.getValue("state") as string;
      return <Badge>{value}</Badge>;
    },
  },
  { // Created timestamp (relative time like "2 hours ago")
    header: "Created",
    accessorKey: "createdTime",
    cell: ({ getValue }) => relative(getValue<string>()),
  },
  { // Fetch timestamp (relative time like "3 days ago")
    header: "Fetched",
    accessorKey: "fetchTime",
    cell: ({ getValue }) => relative(getValue<string>()),
  },
];