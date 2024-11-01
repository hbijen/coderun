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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PistonRequest } from "@/lib/interface";
import { useAvailableRuntimesStore, useQuestionStore, useSampleQuestionStore } from "@/store/question";
import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function CodeSubmit() {
    const [code, setCode] = useState<string>('')
    const [executeResult, setExecuteResult] = useState<string[]>([])

    const availableRuntimes = useAvailableRuntimesStore()
    const sample = useSampleQuestionStore(state => state.sample)
    const selectedRuntime = useQuestionStore(state => state.selectedRuntime)

    const clientId = "X12345"

    // fetch available runtime
    useEffect(() => {
        fetch('/api/runtimes').then(async r => {
            const result = await r.json()
            availableRuntimes.setRuntimes(result.data)
        })
    }, [])


    useEffect(() => {
        setExecuteResult([])
        setCode(sample.code || "")
    }, [sample])

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

    function appendToResult(message: string) {
        setExecuteResult((prev) => [...prev, message])
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
                    appendToResult('Compiling...')
                } else if (resultObj.stage == 'run') {
                    appendToResult('Running...')
                }
                break;
            case 'data':
                // append data to results
                appendToResult(resultObj.data)
                break;
            case 'exit':
                if (resultObj.stage == 'compile') {
                    if(resultObj.code) {
                        appendToResult('Compilation Failed')
                    } else {
                        appendToResult('Compilation Successful')
                    }
                } else if (resultObj.stage == 'run') {
                    console.log("why clientId ", clientId)
                    socket.emit("codelab:completed", JSON.stringify({ clientId: clientId }));
                }
                break;
            default:
                appendToResult(resultObj.message)

        }
    }
    function handleError(error: string) {
        console.log("error?", error)
    }

    async function submitCode() {
        setExecuteResult([])
        if (selectedRuntime) {
            const codeRequest: PistonRequest = {
                language: selectedRuntime.language,
                version: selectedRuntime.version,
                files: [
                    {
                        content: code as string
                    }
                ]
            }
            socket.emit("codelab:submit", JSON.stringify({ clientId: clientId, ...codeRequest }));
        }
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
            <Textarea className="grow"
                placeholder="Code Here!"
                name="code" value={code}
                onChange={(e) => updateCode(e.target.value)}
            />
            <div className="self-center space-x-2">
                <Button onClick={submitCode}>Run</Button>
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
    const [language, setLanguage] = useState<string>("")
    const runtimes = useQuestionStore(state => state.runtimes)
    const setSelectedRuntime = useQuestionStore(state => state.setSelectedRuntime)

    function selectedLanguage(value: string) {
        setLanguage(value)
        setSelectedRuntime( JSON.parse(value) )
    }    
    return (
        <Select name="language" value={language} onValueChange={selectedLanguage}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    {
                    runtimes.map(d => <SelectItem key={`${d.language}${d.version}`} value={JSON.stringify(d)}>{d.language} ({d.version})</SelectItem> )
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function SelectSample() {
    const [sample, setSample] = useState<string>("")
    const setQuestion = useQuestionStore(state => state.setQuestion)
    const setRuntimes = useQuestionStore(state => state.setRuntimes)
    const availableRuntimes = useAvailableRuntimesStore((state) => state.runtimes)
    

    function sampleSelected(value: string) {
        setSample(value)
        const found = SampleCodes.find(d => d.language == value)
        if (found) {
            setQuestion(found.question)
            setRuntimes(availableRuntimes)
            useSampleQuestionStore.setState({sample: found})
        }
    }

    return (
        <Select value={sample} onValueChange={sampleSelected}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Sample" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select a Sample</SelectLabel>
                    {
                    SampleCodes.map(d => <SelectItem key={d.language} value={d.language}>{d.language}</SelectItem> )
                    }                    
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
