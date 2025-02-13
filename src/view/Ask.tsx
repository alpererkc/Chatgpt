import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useHotkeys } from 'react-hotkeys-hook';

import useInfo from '~hooks/useInfo';
import SendIcon from '~icons/Send';

export default function ChatInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const { isMac } = useInfo();

  useEffect(() => {
    invoke('ask_sync', { message: JSON.stringify(message) });
  }, [message])

  useHotkeys(isMac ? 'meta+enter' : 'ctrl+enter', async (event: KeyboardEvent) => {
    event.preventDefault();
    handleSend();
  }, {
    enableOnFormTags: true,
  }, [message]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!message) return;
    await invoke('ask_send', { message: JSON.stringify(message) });
    setMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative flex h-full dark:bg-app-gray-2/[0.98] bg-gray-100 dark:text-slate-200 items-center gap-1">
      <textarea
        ref={inputRef}
        onChange={handleInput}
        spellCheck="false"
        autoFocus
        className="w-full h-full pl-3 pr-[40px] py-2 outline-none resize-none bg-transparent"
        placeholder="Type your message here..."
      />
      <SendIcon
        size={30}
        className="absolute right-2 text-gray-400/80 dark:text-gray-600 cursor-pointer"
        onClick={handleSend}
        title={`Send message (${isMac ? '⌘⏎' : '⌃⏎'})`}
      />
    </div>
  );
}
