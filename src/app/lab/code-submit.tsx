"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SampleCodes } from "@/lib/data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PistonRequest } from "@/lib/interface";
import { SubmissionState, useSubmissionStore } from "@/store/submission";
import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function CodeSubmit() {
    const languageid = useSubmissionStore((state: SubmissionState) => state.languageid)
    const sample = useSubmissionStore((state: SubmissionState) => state.sample)
    const [code, setCode] = useState<string>(sample.code)
    const [executeResult, setExecuteResult] = useState<string[]>([])

    const clientId = "X12345"

    useEffect(() => {
        setExecuteResult([])
        setCode(sample?.code || "")
    }, [languageid])

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        } else {
            console.log('Make new connection is not already connected!')
            socket.connect()
        }

        function onConnect() {
            console.log('ws connected!')
        }

        function onDisconnect() {
            console.log('ws disconnected!')
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("codelab:result", updateResult );
        socket.on("codelab:error", handleError);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("codelab:result", updateResult);
            socket.off("codelab:error", handleError);
        };
    }, []);

    function updateCode(value: string) {
        setCode(value)
    }
    function updateResult(result: string) {
        console.log("result:", result)
        const resultObj = JSON.parse(result)
        switch (resultObj.type) {
            case 'runtime':
                break;
            case 'stage':
                // indicate running
                if (resultObj.stage == 'compile') {
                    setExecuteResult((prev) => [...prev, 'Compiling...'])
                } else if (resultObj.stage == 'run') {
                    setExecuteResult((prev) => [...prev, 'Running...'])
                }
                break;
            case 'data':
                // append data to results
                setExecuteResult((prev) => [...prev, resultObj.data])
                break;
            case 'exit':
                if (resultObj.stage == 'compile') {
                    if(resultObj.code) {
                        setExecuteResult((prev) => [...prev, 'Compilation Failed'])
                    } else {
                        setExecuteResult((prev) => [...prev, 'Compilation Successful'])
                    }
                } else if (resultObj.stage == 'run') {
                    console.log("why clientId ", clientId)
                    socket.emit("codelab:completed", JSON.stringify({ clientId: clientId }));
                }
                break;
        }
    }
    function handleError(error: string) {
        console.log("error?", error)
    }

    async function submitCode() {
        setExecuteResult([])
        const codeRequest: PistonRequest = {
            language: languageid,
            version: sample.version,
            files: [
                {
                    content: code as string
                }
            ]
        }
        socket.emit("codelab:submit", JSON.stringify({ clientId: clientId, ...codeRequest }));
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex gap-12">
                <div className="flex items-center space-x-2">
                    <SelectSample></SelectSample>
                </div>
                <div className="flex items-center space-x-2">
                    <SelectLanguage></SelectLanguage>
                </div>
            </div>
            <Input type="hidden" name="version" value={sample.version}></Input>
            <Textarea className="grow"
                placeholder="Code Here!"
                name="code" value={code}
                onChange={(e) => updateCode(e.target.value)}
            />
            <div className="self-center space-x-2">
                <Button onClick={submitCode}>Submit</Button>
            </div>
            <Label className="text-lg">Output</Label>
            <div className="grow rounded-md border bg-muted p-4">
                <div className="">
                    {executeResult.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}



function SelectLanguage() {
    const languageid = useSubmissionStore((state: SubmissionState) => state.languageid)
    return (
        <Select name="language" value={languageid}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="python">Python (3.12.0)</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function SelectSample() {
    const store = useSubmissionStore()

    function sampleSelected(value: string) {
        store.setLanguage(value)
        store.setSample(SampleCodes[value])
    }

    return (
        <Select onValueChange={sampleSelected}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Sample" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select a Sample</SelectLabel>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
