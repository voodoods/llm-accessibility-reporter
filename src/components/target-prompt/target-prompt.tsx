"use client"

import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PrompterResponse, sendPrompt } from "./prompter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { createReport } from "./reporter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { AxeResults } from "axe-core";
import './target-prompt.css';

import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Skeleton } from "../ui/skeleton";

export function TargetPrompt() {

    const [inputPrompt, setInputPrompt] = useState("")
    const [maxResults, setMaxResults] = useState(5);
    const [isPromptLoading, setIsPromptLoading] = useState(false);
    const [isReportLoading, setIsReportLoading] = useState<{ [key: string] : boolean} | null>(null);
    const [promptResult, setPromptResult] = useState<PrompterResponse | null>(null);
    const [reports, setReports] = useState<AxeResults[]>([]);
    const [activeTab, setActiveTab] = useState("sites");
    const [activeAccordions, setActiveAccordions] = useState([""])
  
    const handleSetInputPrompt = (e: ChangeEvent<HTMLInputElement>) => { 
      setInputPrompt(e.target.value);
    };

    const handleSetMaxResults = (e: ChangeEvent<HTMLInputElement>) => { 
        setMaxResults(parseInt(e.target.value));
      };
  
  
    const handleSendPrompt = async () => {
        setIsPromptLoading(true);

        try {
        const response = await sendPrompt(inputPrompt, maxResults);

        if(response) {
            setPromptResult(response);
            setIsPromptLoading(false);
        }
        } catch {
            setIsPromptLoading(false);
        }
    }

    const handleGenerateReport = async (url: string) => {
        setIsReportLoading({ ...isReportLoading, [url]: true });
        const report = await createReport(url);
        
        setReports([...reports, report]);
        setIsReportLoading(null);
    }

    const handleSetActiveAccordions = (url: string, absolute?: boolean) => {
        if(absolute) {
            setActiveAccordions([url]);
            return
        }
        if(activeAccordions.some(acc => acc.includes(url))) {
            setActiveAccordions(activeAccordions.filter(acc => acc !== url))
        } else {
            setActiveAccordions([...activeAccordions, url])
        }
    }

    const handleShowReport = (url: string) => {
        handleSetActiveAccordions(url, true);
        setActiveTab("reports");
    }
 
    const getRating = (passes: number, violations: number) => {
        const total = passes + violations;
        const passPercentage = parseInt((passes * 100 / total).toFixed(2));

        if(passPercentage === 100) {
            return (
                <>
                {passPercentage}% Excellent <MilitaryTechIcon className="text-yellow-400" />
                </>
            )
        }

        if(passPercentage >= 90) {
            return (
                <>
                {passPercentage}% Good <SentimentSatisfiedAltIcon className="text-yellow-400" />
                </>
            )
        }

        if (passPercentage >= 75) {
            return (
                <>
                {passPercentage}% Average <SentimentDissatisfiedIcon className="text-yellow-400" />
                </>
            )
        }

        if(passPercentage < 75) {
            return (
                <>
                {passPercentage}% Bad <SentimentVeryDissatisfiedIcon className="text-yellow-400" />
                </>
            )
        }
    }

  useEffect(() => {
    console.log("activeTab", activeTab);
    console.log("activeAccordions", activeAccordions)
  }, [activeTab, activeAccordions])

  return (
    <div className="flex flex-row w-full">
        <div className="w-1/2 mr-10">
            <div className="flex flex-col w-full justify-between">
                <h3 className="mb-2">What kind of sites are you looking for?</h3>
                <Input className="w-6/6 mr-5" type="text" id="enter-prompt" placeholder="" onChange={handleSetInputPrompt} />
                <h3 className="mt-5 mb-2">Max number of results?</h3>
                <Input className="w-2/6 mr-5" type="number" id="enter-max-count" value={maxResults} onChange={handleSetMaxResults} />
                <Button className="w-1/6 mt-5" onClick={handleSendPrompt} disabled={isPromptLoading}>{isPromptLoading ? 'Loading Results...' : 'Send' }</Button>
            </div>
        </div>
        <div className="w-1/2">

            <Tabs defaultValue="sites" value={activeTab} className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sites" onClick={() => setActiveTab("sites")}>Sites ({promptResult?.results.length ?? 0})</TabsTrigger>
                    <TabsTrigger value="reports" onClick={() => setActiveTab("reports")}>Reports ({reports.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="sites">
                    <div className="py-5 px-2">
                        {!promptResult && !isPromptLoading ? "No Results yet." : (
                            <>
                                {isPromptLoading ? (
                                    <>
                                        <div className="flex flex-col items-start mb-6">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[300px]" />
                                                <Skeleton className="h-4 w-[450px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                            <Skeleton className="h-[36px] w-[157px] mt-5" />
                                        </div>

                                        <div className="flex flex-col items-start mb-6">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[300px]" />
                                                <Skeleton className="h-4 w-[450px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                            <Skeleton className="h-[36px] w-[157px] mt-5" />
                                        </div>

                                        <div className="flex flex-col items-start">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[300px]" />
                                                <Skeleton className="h-4 w-[450px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                            <Skeleton className="h-[36px] w-[157px] mt-5" />
                                        </div>
                                    </>
                                ) :  (
                                    <>
                                    {promptResult?.results.map(result => (
                                            <div key={result.url} className="mb-6">
                                                <p><b>Name: </b>{result.name}</p>
                                                <p><b>Description: </b>{result.description}</p>
                                                <p><b>Url: </b>{result.url}</p>

                                            {reports.some(report => report.url.includes(result.url)) ? ( 
                                                <Button className="w-auto mt-5" onClick={() => handleShowReport(result.url)}>
                                                    <SearchIcon className="mr-2" /> Show Report 
                                                </Button>
                                            ) : (
                                                <Button className="w-auto mt-5" onClick={() => handleGenerateReport(result.url)} disabled={!!isReportLoading}>
                                                {
                                                !(isReportLoading && isReportLoading[result.url]) ? (
                                                    <>
                                                        <AssessmentIcon className="mr-2"/> Create Report
                                                    </>
                                                ) : (
                                                    <>
                                                     <TrackChangesIcon className="loader mr-2"></TrackChangesIcon> Analyzing page 
                                                    </>
                                                )}
                                                </Button>
                                            )}   

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
                    <Accordion value={activeAccordions} type="multiple" className="w-full">
                        {reports.map(report => (
                            <AccordionItem value={report.url} key={report.url}>
                                <AccordionTrigger onClick={() => handleSetActiveAccordions(report.url)}>Report for {report.url}</AccordionTrigger>
                                <AccordionContent>
                                    <p><b>Report created at:</b> {Intl.DateTimeFormat("de-DE", { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Berlin'}).format(new Date(report.timestamp))}</p>
                                    <p><b>Passes:</b> {report.passes.length} <CheckCircleIcon className="text-green-500" /><br/></p>
                                    <p><b>Violations:</b> {report.violations.length} <CancelIcon className="text-red-500" /></p>
                                    <p className="mt-5"><b>Rating:</b> {getRating(report.passes.length, report.violations.length)}</p>
                                 
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                       
                    </Accordion>
                    </div>
                </TabsContent>
            </Tabs>

      
        </div>
    </div>
  )
}