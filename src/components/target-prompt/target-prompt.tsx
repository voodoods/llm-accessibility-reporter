"use client"

import { useState, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PrompterResponse, sendPrompt } from "./prompter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { createReports } from "./reporter";

export function TargetPrompt() {

    const [inputPrompt, setInputPrompt] = useState("")
    const [maxResults, setMaxResults] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [promptResult, setPromptResult] = useState<PrompterResponse | null>(null);
    const [reports, setReports] = useState<LHResult[]>([]);
  
    const handleSetInputPrompt = (e: ChangeEvent<HTMLInputElement>) => { 
      setInputPrompt(e.target.value);
    };

    const handleSetMaxResults = (e: ChangeEvent<HTMLInputElement>) => { 
        setMaxResults(parseInt(e.target.value));
      };
  
  
    const handleSendPrompt = async () => {
        setIsLoading(true);
        const response = await sendPrompt(inputPrompt, maxResults);

        console.log(response)

        if(response) {
            setPromptResult(response);
            setIsLoading(false);
        }
    }

    const handleGenerateReports = async () => {
        if(!promptResult?.results) {
            console.error("No URLs to report about!")
        }

        const urls = promptResult?.results.map(result => result.url);

        const lighthouseReports = await createReports(urls ?? [""]);

        if(lighthouseReports) {
            console.log(lighthouseReports)
            setReports([lighthouseReports])
        }
    }

  return (
    <div className="flex flex-row w-full">
        <div className="w-1/2 mr-10">
            <div className="flex flex-col w-full justify-between">
                <h3 className="mb-2">What kind of sites are you looking for?</h3>
                <Input className="w-6/6 mr-5" type="text" id="enter-prompt" placeholder="" onChange={handleSetInputPrompt} />
                <h3 className="mt-5 mb-2">Max number of results?</h3>
                <Input className="w-2/6 mr-5" type="number" id="enter-max-count" value={maxResults} onChange={handleSetMaxResults} />
                <Button className="w-1/6 mt-5" onClick={handleSendPrompt} disabled={isLoading}>Send</Button>

                {promptResult ? <Button className="w-1/6 mt-5" onClick={handleGenerateReports}>Create Reports!</Button> : null }
            </div>
        </div>
        <div className="w-1/2">

            <Tabs defaultValue="sites" className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sites">Sites</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="sites">
                    <div className="py-5 px-2">
                        {!promptResult && !isLoading ? "No Results yet." : (
                            <>
                                {isLoading ? "Loading result..." :  (
                                    <>
                                    {promptResult?.results.map(result => (
                                            <div key={result.url} className="mb-6">
                                                <p><b>Name: </b>{result.name}</p>
                                                <p><b>Description: </b>{result.description}</p>
                                                <p><b>Url: </b>{result.url}</p>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="reports">
                    <div className="py-5 px-2">
                        TBD
                    </div>
                </TabsContent>
            </Tabs>

      
        </div>
    </div>
  )
}