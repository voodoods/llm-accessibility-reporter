"use server";

import ollama from 'ollama';

export interface PrompterResult {
  name: string;
  description: string;
  url: string;
}

export interface PrompterResponse {
  results: PrompterResult[];
}

export async function sendPrompt (prompt: string, maxResults: number): Promise<PrompterResponse> {
    let results;
    const response = await ollama.chat({
    model: 'llama3.1',
    messages: [
        { role: 'system', content: `
            The result should be a JSON format containing an array of results.
            The top level property of the JSON containing the array as its value should be 'results'.
            
            A result represents an object describing a company name, a description of the company and an url to the company website. 
            A result should contain a name property containing a company name as value.
            A result should contain a description property containing a short description of the company with a maximum 200 characters length. 
            A result should contain a url property with an URL of the company's website.
       
            Don't provide any other content than the JSON object.
            The maximum number of results should be ${maxResults}
        ` },
        { role: 'user', content: prompt }
    ],
  })
  
  try {
    results = JSON.parse(response.message.content);
  } catch {
    throw new Error('Prompt result is not a valid JSON format!')
  }

  if (results.results) {
    return results
  } else {
    return { results }
  }
}