"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

import { columns as baseColumns } from "./columns"; // same folder

// types & libs
import type { FlatRow, ResourceWrapper } from "../../types/resource";
import { relative } from "../../lib/time";
import { db } from "../../lib/firebase";

// firestore
import { collection, getDocs } from "firebase/firestore";

// shadcn/ui
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";


//To humanize (by labeling and coloring) the processing state
function formatState(state?: string): { label: string; color: string } {
    switch (state) {
      case "PROCESSING_STATE_COMPLETED":
        return { label: "Completed", color: "bg-green-600" };
      case "PROCESSING_STATE_NOT_STARTED":
        return { label: "Pending", color: "bg-yellow-500" };
      case "PROCESSING_STATE_FAILED":
        return { label: "Failed", color: "bg-red-500" };
      case "PROCESSING_STATE_PROCESSING":
        return { label: "Processing", color: "bg-yellow-500" };
      case "PROCESSING_STATE_UNSPECIFIED":
        return { label: "Processing", color: "bg-gray-500" };
      default:
        return { label: state ?? "—", color: "bg-gray-500" };
    }
}

export default function ResourceTable() {
    const [data, setData] = useState<FlatRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<FlatRow | null>(null);

    useEffect(() => {
        (async () => {
        // Read all docs from collection, fetching from FireStore
        const snap = await getDocs(collection(db, "resourceWrappers"));

        // Map/Flatten nested Firestore documents into table rows
        const rows: FlatRow[] = snap.docs.map(d => {
            const doc = d.data() as ResourceWrapper;
            const m = doc.resource?.metadata;
            return {
            id: d.id,
            resourceType: m?.resourceType ?? "—",
            createdTime: m?.createdTime ?? "",
            fetchTime: m?.fetchTime ?? "",
            processedTime: m?.processedTime ?? "",
            humanReadableStr: doc.resource?.humanReadableStr,
            aiSummary: doc.resource?.aiSummary,
            state: m?.state ?? "-",
            version: m?.version ?? "-",
            };
        });

        //sort newest first by createdTime
        rows.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        setData(rows);
        setLoading(false);
        })();
    }, []);

    const columns = useMemo(() => baseColumns, []);
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    if (loading) {
        return (
        <Card className="m-6 p-8 flex items-center justify-center text-muted-foreground">
            <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"/>
            </svg>
            <span>Loading resources…</span>
            </div>
        </Card>
        );
    }

    return (
        <Card className="m-6 p-4">
        <div className="text-lg font-medium mb-3">Resources</div>

        <Table>
            <TableHeader>
            {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id}>
                {hg.headers.map(h => (
                    <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                ))}
                </TableRow>
            ))}
            </TableHeader>

            <TableBody>
            {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(r => (
                <TableRow
                    key={r.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelected(r.original)}
                >
                    {r.getVisibleCells().map(c => (
                        <TableCell key={c.id}>
                            {c.column.id === "resourceType" ? (
                            <Badge>{String(c.getValue())}</Badge>
                            ) : c.column.id === "state" ? (
                            <Badge className={`${formatState(c.getValue() as string).color} text-white`}>
                                {formatState(c.getValue() as string).label}
                            </Badge>
                            ) : (
                            flexRender(c.column.columnDef.cell, c.getContext())
                            )}
                        </TableCell>
                        ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
                )
            }
            </TableBody>
        </Table>
        
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-xl bg-white rounded-2xl">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
                {selected?.resourceType}
                {selected?.state && (
                <Badge className={`rounded-full px-3 py-1 text-white ${formatState(selected.state).color}`}>
                    {formatState(selected.state).label}
                </Badge>
                )}
            </DialogTitle>

            <div className="space-x-3">
                {selected?.state && (
                <span className="text-xs text-muted-foreground">
                    Internal code: <span className="font-mono">{selected.state}</span>
                </span>
                )}
                {selected?.version && (
                <span className="text-xs text-muted-foreground">
                    FHIR: <span className="font-mono">{selected.version}</span>
                </span>
                )}
            </div>
            </DialogHeader>

            <div className="space-y-6">
            <section>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Human Readable String</p>
                <p className="mt-1 leading-7">{selected?.humanReadableStr || "—"}</p>
            </section>

            <section>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">AI Summary</p>
                <p className="mt-1 leading-7">{selected?.aiSummary || "—"}</p>
            </section>

            <hr className="border-neutral-200" />

            <section>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Timestamps</p>
                <ul className="mt-1 space-y-1 text-sm">
                <li>
                    <span className="font-medium">Created:</span>{" "}
                    {selected?.createdTime ? (
                    <>
                        {relative(selected.createdTime)}{" "}
                        <span className="text-xs text-muted-foreground">
                        ({new Date(selected.createdTime).toLocaleString()})
                        </span>
                    </>
                    ) : "—"}
                </li>
                <li>
                    <span className="font-medium">Fetched:</span>{" "}
                    {selected?.fetchTime ? (
                    <>
                        {relative(selected.fetchTime)}{" "}
                        <span className="text-xs text-muted-foreground">
                        ({new Date(selected.fetchTime).toLocaleString()})
                        </span>
                    </>
                    ) : "—"}
                </li>
                <li>
                    <span className="font-medium">Processed:</span>{" "}
                    {selected?.processedTime ? (
                    <>
                        {relative(selected.processedTime)}{" "}
                        <span className="text-xs text-muted-foreground">
                        ({new Date(selected.processedTime).toLocaleString()})
                        </span>
                    </>
                    ) : "—"}
                </li>
                </ul>
            </section>
            </div>
        </DialogContent>
        </Dialog>
        </Card>
    );
}