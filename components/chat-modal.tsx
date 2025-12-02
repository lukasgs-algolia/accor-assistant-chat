'use client';

import { Conversation, ConversationContent, ConversationEmptyState } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { searchIndex, Params } from '@/app/api/chat/tools/search_index';
import { MessageCircle, X } from 'lucide-react';

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
      switch (toolName) {
        case "searchIndex":
          const searchIndexInput: Params = toolCall.input as Params
          console.log(searchIndexInput)
          const config = {
            appId: "N6BK2U6YFA",
            apiKey: "6e862903176c4e62c4678c04cc8486ba"
          }
          const results = await searchIndex({ config: config, params: searchIndexInput })
          addToolOutput({
            tool: toolName,
            toolCallId: toolCall.toolCallId,
            output: { message: "Queried Algolia Index", response: results },
          })
          break
        case "getWeather":
          const getWeatherInput: { city: string } = toolCall.input as { city: string }
          console.log(getWeatherInput)
          addToolOutput({
            tool: toolName,
            toolCallId: toolCall.toolCallId,
            output: {
              message: "Fetched weather information",
              response: {
                city: getWeatherInput.city,
                temperature: Math.round(Math.random() * (90 - 32) + 32)
              }
            }
          })
          break
        case "logStructuredRequest":
          const logStructuredRequestInput = toolCall.input
          console.log(logStructuredRequestInput)
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
          className="max-w-4xl h-[80vh] p-0 flex flex-col gap-0 overflow-hidden"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">ALL Chat Assistant</DialogTitle>

          {/* Modal Header */}
          <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">ALL Chat Assistant</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-primary-foreground/10 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <Conversation className="flex-1 h-full">
              <ConversationContent className="px-4 py-6">
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    title="Welcome to ALL"
                    description="Ask your question or start a conversation"
                  />
                ) : (
                  <>
                    {messages.map((message) => {
                      const messageText = message.parts?.map((part) => part.type === 'text' ? part.text : '').join('') || '';
                      const isEmpty = message.role === 'assistant' && !messageText;

                      // Don't render empty assistant messages
                      if (isEmpty) return null;

                      return (
                        <Message
                          key={message.id}
                          from={message.role}
                        >
                          <MessageContent
                            className={
                              message.role === 'assistant'
                                ? 'bg-card text-foreground rounded-lg px-6 py-4'
                                : 'bg-primary! text-primary-foreground! rounded-lg px-6 py-4'
                            }
                          >
                            {message.role === 'assistant' ? (
                              <MessageResponse>
                                {messageText}
                              </MessageResponse>
                            ) : (
                              message.parts?.map((part) => {
                                return part.type === 'text' && part.text
                              })
                            )}
                          </MessageContent>
                        </Message>
                      );
                    })}
                    {isThinking && (
                      <Message from="assistant">
                        <MessageContent className="bg-card text-foreground rounded-lg px-6 py-4">
                          <div className="flex gap-1">
                            <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </MessageContent>
                      </Message>
                    )}
                  </>
                )}
              </ConversationContent>
            </Conversation>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4 shrink-0">
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
                  className="py-2 text-foreground placeholder:text-muted-foreground"
                />
                <PromptInputSubmit
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-10 w-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                />
              </PromptInput>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
