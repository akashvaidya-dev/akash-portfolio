import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Code2, Sparkles, Cpu, Layers } from 'lucide-react';

const snippets = [
  {
    id: 'escpos',
    filename: 'thermal_printer_service.dart',
    language: 'Dart / Flutter',
    badge: 'Hardware ESC/POS',
    icon: Cpu,
    code: `// Hardware ESC/POS binary stream generator for Bluetooth & WiFi printers
class ThermalPrinterService {
  final BluetoothConnection _connection;
  
  Future<void> printReceipt(OrderReceipt receipt) async {
    final generator = Generator(PaperSize.mm80, await CapabilityProfile.load());
    List<int> bytes = [];

    // Initialize printer & set bold header
    bytes += generator.reset();
    bytes += generator.text(receipt.storeName,
        styles: const PosStyles(align: PosAlign.center, bold: true, height: PosTextSize.size2));
    bytes += generator.feed(1);

    // Dynamic itemized table layout
    for (final item in receipt.items) {
      bytes += generator.row([
        PosColumn(text: item.name, width: 7),
        PosColumn(text: "x" + item.qty.toString(), width: 2),
        PosColumn(text: "₹" + item.subtotal.toString(), width: 3, styles: const PosStyles(align: PosAlign.right)),
      ]);
    }

    // Cut paper and flush binary payload
    bytes += generator.feed(2);
    bytes += generator.cut();
    await _connection.output.add(Uint8List.fromList(bytes));
    await _connection.output.allSent;
  }
}`,
  },
  {
    id: 'riverpod',
    filename: 'order_state_provider.dart',
    language: 'Dart / Riverpod',
    badge: 'State Machine',
    icon: Layers,
    code: `// Deterministic Riverpod state notifier for Voice POS order stream
@riverpod
class OrderNotifier extends _$OrderNotifier {
  @override
  OrderState build() => const OrderState.initial();

  Future<void> processVoiceTranscript(String speechInput) async {
    state = state.copyWith(isProcessingVoice: true);
    try {
      final parsedItem = await ref.read(voiceMenuParserProvider).parse(speechInput);
      if (parsedItem != null) {
        final updatedItems = [...state.items, parsedItem];
        final total = updatedItems.fold<double>(0, (sum, i) => sum + (i.price * i.qty));
        state = state.copyWith(
          items: updatedItems,
          totalAmount: total,
          isProcessingVoice: false,
        );
      }
    } catch (err) {
      state = state.copyWith(error: err.toString(), isProcessingVoice: false);
    }
  }
}`,
  },
  {
    id: 'websocket',
    filename: 'useRealtimeInbox.js',
    language: 'React 19 / WS',
    badge: 'Web Architecture',
    icon: Code2,
    code: `// Real-time multi-agent conversation sync with auto-reconnect
export function useRealtimeInbox(channelId) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(\`wss://api.domain.com/crm/channels/' + channelId\`);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'MESSAGE_RECEIVED') {
        setMessages((prev) => [...prev, payload.data]);
      }
    };

    return () => socket.close();
  }, [channelId]);

  const dispatchMessage = (text) => {
    wsRef.current?.send(JSON.stringify({ action: 'SEND', text, timestamp: Date.now() }));
  };

  return { messages, dispatchMessage };
}`,
  },
];

/**
 * Format code lines with highlighted comments so comments stand out cleanly
 * and adapt with optimal contrast in both light and dark themes.
 */
function renderHighlightedCode(code) {
  const lines = code.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('//')) {
      const indent = line.slice(0, line.length - trimmed.length);
      return (
        <span key={idx} className="code-line">
          {indent}
          <span className="code-comment">{trimmed}</span>
          {idx < lines.length - 1 ? '\n' : ''}
        </span>
      );
    }
    return (
      <span key={idx} className="code-line">
        {line}
        {idx < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}

export default function CodePlayground() {
  const [activeTab, setActiveTab] = useState(snippets[0].id);
  const [copied, setCopied] = useState(false);

  const currentSnippet = snippets.find((s) => s.id === activeTab) || snippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-playground-wrap">
      {/* Window Titlebar */}
      <div className="terminal-titlebar">
        <div className="window-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>

        {/* Snippet Tabs */}
        <div className="terminal-tabs" role="tablist">
          {snippets.map((snippet) => {
            const Icon = snippet.icon;
            const isActive = snippet.id === activeTab;
            return (
              <button
                key={snippet.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={`terminal-tab ${isActive ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(snippet.id)}
              >
                <Icon size={14} className={isActive ? 'text-accent' : 'text-muted'} />
                <span>{snippet.filename}</span>
                {isActive && (
                  <motion.span
                    layoutId="active-terminal-tab"
                    className="tab-highlight-bar"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          className="terminal-copy-btn"
          onClick={handleCopy}
          aria-label="Copy snippet code"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Display Area */}
      <div className="terminal-content-area">
        <div className="terminal-meta-bar">
          <span className="badge badge-accent">
            <Sparkles size={11} style={{ marginRight: 4 }} />
            {currentSnippet.badge}
          </span>
          <span className="terminal-lang-badge">{currentSnippet.language}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSnippet.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="terminal-code-scroll"
          >
            <pre className="code-block">
              <code>{renderHighlightedCode(currentSnippet.code)}</code>
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
