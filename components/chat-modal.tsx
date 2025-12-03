'use client';

import { Conversation, ConversationContent, ConversationEmptyState } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { HotelCard } from "@/components/hotel-card";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { searchIndex, Params } from '@/app/api/chat/tools/search_index';
import { getWeatherForecast } from "@/app/api/chat/tools/get_weather";
import { MessageCircle, X } from 'lucide-react';

// Helper function to extract hotel search results from message parts
function getHotelResults(parts: any[]): any[] {
  if (!parts) return [];

  const hotelParts = parts.filter(
    (part: any) =>
      part.type === 'tool-searchIndex' &&
      part.output?.response?.hits &&
      Array.isArray(part.output.response.hits) &&
      part.output.response.hits.length > 0
  );

  return hotelParts.flatMap((part: any) => part.output.response.hits.slice(0, 10));
}

export function ChatModal() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { messages, status, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport(
      {
        api: "https://n6bk2u6yfa.algolia.net/agent-studio/1/agents/80b01c58-0e4d-4d36-969e-cb8e60170bce/completions?compatibilityMode=ai-sdk-5",
        headers: {
          "x-algolia-application-id": "N6BK2U6YFA",
          "x-algolia-api-key": "6e862903176c4e62c4678c04cc8486ba"
        }
      }
    ),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({toolCall}) {
      const toolName = toolCall.toolName
      console.log("Tool call: ", toolName)
      console.log(toolCall.input)
      switch (toolName) {
        case "searchIndex":
          const config = {
            appId: "N6BK2U6YFA",
            apiKey: "6e862903176c4e62c4678c04cc8486ba"
          }
          const results = await searchIndex({ config: config, params: toolCall.input as Params })
          addToolOutput({
            tool: toolName,
            toolCallId: toolCall.toolCallId,
            output: { message: "Queried Algolia Index", response: results },
          })
          break
        case "getWeather":
          const { latitude, longitude }= toolCall.input as { latitude: number, longitude: number }
          addToolOutput({
            tool: toolName,
            toolCallId: toolCall.toolCallId,
            output: {
              message: "Fetched weather information",
              response: {
                weatherForecast: await getWeatherForecast(
                  latitude,
                  longitude,
                )
              }
            }
          })
          break
        case "logStructuredRequest":
          addToolOutput({
            tool: toolName,
            toolCallId: toolCall.toolCallId,
            output: "Structured request object logged to console."
          })
          break
        default:
          break
      }
    }
  });

  const isLoading = status === "streaming" || status === "submitted";
  const lastMessage = messages[messages.length - 1];

  // Show thinking indicator if we're loading and either:
  // 1. The last message is from the user, OR
  // 2. The last message is from assistant but has no content yet
  const lastMessageText = lastMessage?.parts?.map((part) => part.type === 'text' ? part.text : '').join('') || '';
  const isThinking = isLoading &&
    messages.length > 0 &&
    (lastMessage?.role === "user" || (lastMessage?.role === "assistant" && !lastMessageText));

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="!max-w-6xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">ALL Chat Assistant</DialogTitle>

          {/* Modal Header */}
          <div className="bg-primary text-primary-foreground px-8 py-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <MessageCircle className="h-6 w-6" />
              <h2 className="text-xl font-semibold">ALL Chat Assistant</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-primary-foreground/10 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <Conversation className="flex-1 h-full">
              <ConversationContent className="px-5 py-8">
                {messages.length === 0 ? (
                  <>
                    <ConversationEmptyState
                      title="Welcome to ALL"
                      description="Ask your question or start a conversation"
                    />
                    <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                      <Suggestion
                        suggestion="Help me find somewhere I can relax in Paris"
                        onClick={(suggestion) => {
                          sendMessage({ text: suggestion });
                        }}
                      />
                      <Suggestion
                        suggestion="I am visiting London with my kids. What will the weather be like?"
                        onClick={(suggestion) => {
                          sendMessage({ text: suggestion });
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {messages.map((message) => {
                      const messageText = message.parts?.map((part) => part.type === 'text' ? part.text : '').join('\n') || '';
                      const isEmpty = message.role === 'assistant' && !messageText.trim();

                      // Don't render empty assistant messages
                      if (isEmpty) return null;

                      return (
                        <Message
                          key={message.id}
                          from={message.role}
                        >
                          {message.role === 'assistant' ? (
                            <>
                              {/* Show hotels carousel for assistant messages with hotel search results */}
                              {(() => {
                                const hotels = getHotelResults(message.parts as any[]);
                                if (hotels.length === 0) return null;

                                return (
                                  <div className="mb-4 relative">
                                    <div className="max-w-3xl mx-auto px-14">
                                      <h4 className="text-base font-medium text-muted-foreground mb-2">
                                        You might like:
                                      </h4>
                                      <Carousel
                                        opts={{
                                          align: "start",
                                          loop: false,
                                          slidesToScroll: 3,
                                        }}
                                        className="w-full"
                                      >
                                        <CarouselContent className="-ml-5 py-3">
                                          {hotels.map((hotel: any) => (
                                            <CarouselItem
                                              key={hotel.objectID || hotel.id}
                                              className="pl-5 basis-1/3"
                                            >
                                              <HotelCard hotel={hotel} />
                                            </CarouselItem>
                                          ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="-left-12" />
                                        <CarouselNext className="-right-12" />
                                      </Carousel>
                                    </div>
                                  </div>
                                );
                              })()}

                              <MessageContent
                                className="bg-card text-foreground rounded-lg px-8 py-5 text-base"
                              >
                                <MessageResponse>
                                  {messageText}
                                </MessageResponse>
                              </MessageContent>
                            </>
                          ) : (
                            <MessageContent
                              className="bg-primary! text-primary-foreground! rounded-lg px-8 py-5 text-base"
                            >
                              {message.parts?.map((part) => {
                                return part.type === 'text' && part.text
                              })}
                            </MessageContent>
                          )}
                        </Message>
                      );
                    })}
                    {isThinking && (
                      <Message from="assistant">
                        <MessageContent className="bg-card text-foreground rounded-lg px-8 py-5">
                          <div className="flex gap-1.5">
                            <span className="inline-block w-2.5 h-2.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="inline-block w-2.5 h-2.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="inline-block w-2.5 h-2.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </MessageContent>
                      </Message>
                    )}
                  </>
                )}
              </ConversationContent>
            </Conversation>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-5 shrink-0">
              <PromptInput
                onSubmit={(message, event) => {
                  event.preventDefault();
                  if (message.text) {
                    sendMessage({ text: message.text });
                    setInput("");
                  }
                }}
                className="**:data-[slot=input-group]:bg-white **:data-[slot=input-group]:rounded-full **:data-[slot=input-group]:border-input **:data-[slot=input-group]:pl-5 **:data-[slot=input-group]:pr-1.5 **:data-[slot=input-group]:py-1.5 **:data-[slot=input-group]:shadow-sm **:data-[slot=input-group]:h-auto"
              >
                <PromptInputTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Where would you like to travel?"
                  disabled={isLoading}
                  rows={1}
                  className="py-3 text-base text-foreground placeholder:text-muted-foreground"
                />
                <PromptInputSubmit
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 w-12 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                />
              </PromptInput>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
