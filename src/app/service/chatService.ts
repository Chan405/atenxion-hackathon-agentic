export async function chat(agentId: string, message: string) {
  try {
    const streamMessage = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        message,
      }),
    });
    console.log({ streamMessage });
    if (streamMessage?.status !== 200) {
      throw new Error("Service Failure");
    }
    if (streamMessage.ok) {
      console.log("streaming");

      const reader = streamMessage.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      while (!done) {
        const { done: isDone, value } = await (reader?.read() as Promise<
          ReadableStreamReadResult<Uint8Array>
        >);

        done = isDone;

        // if (streamingRef.current) {
        //   streamingRef.current = false;
        //   break;
        // }
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        let isLoadingStopped = false;
        for (const line of lines) {
          if (!line.trim()) continue;
          console.log({ line });
          if (line.startsWith("data:")) {
            const dataString = line.substring(5).trim();
            if (!dataString) continue;
            try {
              const jsonData = JSON.parse(dataString);
              console.log(jsonData);
              // if (jsonData.status === "error") {
              //   throw jsonData;
              // }
              // if (jsonData.status === "streaming") {
              //   if (jsonData.response.length > 0 && !isLoadingStopped) {
              //     isLoadingStopped = true;
              //   }
              // } else if (jsonData.status === "End of stream") {
              //   const newMessageId = jsonData.newMessageId;
              //   const fullMessageResponse = await fetch(
              //     `/api/message/${newMessageId}`
              //   );

              //   const fullMessage = await fullMessageResponse.json();
              //   // console.log({ fullMessage });
              // }
            } catch (error: any) {
              if (error.status === "error") {
                throw error;
              } else {
                console.error("Invalid JSON in data:", dataString, error);
                continue;
              }
            }
          }
        }
      }
    } else if (!streamMessage.ok) {
      const jsonData = await streamMessage.json();
      console.log("streamMessage not ok", jsonData);
    }
  } catch (error: any) {
    console.log("Error", error);
  }
}
