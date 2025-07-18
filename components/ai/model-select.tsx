"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DEFAULT_MODELS } from "@/lib/ai/utils";
import { OpenAIModel } from "@/lib/ai/types";

interface ModelSelectProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  models?: OpenAIModel[];
}

export function ModelSelect({
  selectedModel,
  onModelChange,
  models = DEFAULT_MODELS,
}: ModelSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedModel
            ? models.find(model => model.id === selectedModel)?.name ||
              selectedModel
            : "选择模型..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索模型..." />
          <CommandEmpty>未找到模型</CommandEmpty>
          <CommandGroup>
            {models.map(model => (
              <CommandItem
                key={model.id}
                value={model.id}
                onSelect={() => {
                  onModelChange(model.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedModel === model.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  {model.description && (
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
