/**
 * Death Note — The Bug Log Data Module
 *
 * Real debugging case files transformed into dramatic engineering case studies.
 * Each case documents the incident, root cause, executed fix, architectural pattern,
 * and permanent rule inscribed in the defect grimoire.
 */

export const bugLogRules = [
  {
    ruleNumber: 'Rule I',
    statement: 'The bug whose root cause is accurately inscribed in this notebook shall never crash production again.',
  },
  {
    ruleNumber: 'Rule II',
    statement: 'This log takes effect only when the engineer holds both the reproduction stack trace and the failing invariant in mind while writing the fix.',
  },
  {
    ruleNumber: 'Rule III',
    statement: 'If a regression test is committed alongside the resolution within 40 minutes, the defect is eliminated permanently across all branches.',
  },
  {
    ruleNumber: 'Rule IV',
    statement: 'A patched bug whose underlying architectural anti-pattern remains unaddressed will reincarnate under another ticket number.',
  },
];

export const bugCategories = [
  { id: 'all', label: 'All Cases' },
  { id: 'hardware-mobile', label: 'Hardware & Flutter' },
  { id: 'auth-security', label: 'Auth & Security' },
  { id: 'state-cache', label: 'Cache & State Sync' },
  { id: 'realtime-web', label: 'Real-time & Web' },
];

export const bugCases = [
  {
    id: 'expired-token-race',
    caseNumber: '#001',
    title: 'The Case of the Expired Token Stampede',
    alias: 'The 401 Replay Flood',
    project: 'Flutter Client · Auth Gateway',
    subsystem: 'Dio / Riverpod Interceptor',
    category: 'auth-security',
    severity: 'CRITICAL',
    dateEliminated: 'Oct 2024',
    status: 'ELIMINATED',
    storySummary:
      'Five concurrent API requests returned 401 Unauthorized simultaneously upon app wake-up, prompting five duplicate token refresh calls. The OAuth server rotated the refresh token on the first request and immediately invalidated the subsequent four, logging users out violently.',
    incident:
      'When users backgrounded the mobile app for over an hour and resumed it, the dashboard dispatched 5 parallel HTTP calls (profile, notifications, unread chats, balance, orders). Because the access token had just expired, all 5 failed with HTTP 401 at the exact same millisecond. Each failed request independently invoked `refreshToken()`. The auth server strictly enforces single-use refresh token rotation—the first call succeeded, but calls 2 through 5 submitted an already-spent refresh token. The auth server flagged this as token replay fraud and revoked the user session completely.',
    culprit:
      'Missing concurrency lock / mutex synchronization around the asynchronous token refresh handler. Every interceptor acted in isolation without verifying if a refresh operation was already in-flight.',
    verdict:
      'Implemented a thread-safe Async Mutex & Queued Request Barrier. When the first 401 arrives, it acquires the refresh lock and creates a shared Completer. Subsequent 401 requests pause and join a pending queue. Once the new token arrives, all queued requests update their headers and replay simultaneously without touching the refresh endpoint again.',
    rule: 'Token refresh must always be an atomic single-flight barrier. Never allow concurrent refresh cycles.',
    codeSnippet: `// Dart / Riverpod Auth Interceptor Mutex
class TokenRefreshInterceptor extends QueuedInterceptor {
  Completer<String>? _refreshCompleter;

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode != 401) return handler.next(err);

    // If refresh is already running, wait on the active flight
    if (_refreshCompleter != null && !_refreshCompleter!.isCompleted) {
      final newToken = await _refreshCompleter!.future;
      return _retryWithNewToken(err.requestOptions, newToken, handler);
    }

    _refreshCompleter = Completer<String>();
    try {
      final newAccessToken = await authRepository.rotateSession();
      _refreshCompleter!.complete(newAccessToken);
      return _retryWithNewToken(err.requestOptions, newAccessToken, handler);
    } catch (refreshErr) {
      _refreshCompleter!.completeError(refreshErr);
      await authRepository.forceLogout();
      return handler.next(err);
    }
  }
}`,
    impact: 'Session revocation dropped from 4.2% of mobile resumes to 0.00% across 10,000+ app sessions.',
  },
  {
    id: 'escpos-buffer-overflow',
    caseNumber: '#002',
    title: 'The Case of the Zombie Thermal Buffer',
    alias: 'The Kitchen Ticket Guillotine',
    project: 'Xtream Arena (Voice POS)',
    subsystem: 'ESC/POS Thermal Printing Engine',
    category: 'hardware-mobile',
    severity: 'CRITICAL',
    dateEliminated: 'Nov 2024',
    status: 'ELIMINATED',
    storySummary:
      'During high-volume restaurant billing rushes, thermal receipt printers hung mid-receipt, spitting out truncated kitchen order tickets and locking the billing counter until the printer was physically power-cycled.',
    incident:
      'When cashiers punched 6 back-to-back food orders within 10 seconds, raw ESC/POS command bytes were piped directly into the printer’s raw TCP socket (`port 9100`). The low-cost commercial 80mm thermal printer had a tiny 4KB internal FIFO hardware buffer. As large raster graphic logos and double-height fonts streamed faster than the thermal printhead could burn paper, the printer buffer overflowed, corrupted ESC/POS control bytes, and entered an unresponsive zombie halt state.',
    culprit:
      'Unthrottled socket writes with zero backpressure management. The application assumed TCP socket acknowledgment equated to the thermal printhead physically finishing the print job.',
    verdict:
      'Engineered a Chunked Hardware Flow Controller with Real-time Status Inquiry. Print jobs are sliced into 512-byte payloads. After every chunk, the engine sends an ESC/POS real-time status request (`DLE EOT 1`) and awaits the printer hardware status byte verifying "Paper Present & Ready" before dispatching the next block.',
    rule: 'Software must never stream faster than physical hardware can mechanically execute. Always respect buffer backpressure.',
    codeSnippet: `// Dart / ESC-POS Hardware Flow Controller
Future<void> sendSafePrintJob(Socket socket, List<int> rawBytes) async {
  const chunkSize = 512;
  for (int i = 0; i < rawBytes.length; i += chunkSize) {
    final chunk = rawBytes.sublist(i, min(i + chunkSize, rawBytes.length));
    socket.add(chunk);
    await socket.flush();

    // Query printer hardware status: DLE EOT 1 (Printer Status)
    socket.add([0x10, 0x04, 0x01]);
    final statusByte = await socket.first.timeout(const Duration(milliseconds: 300));
    final isBufferReady = (statusByte.first & 0x08) == 0; // Bit 3 checks offline
    if (!isBufferReady) {
      await Future.delayed(const Duration(milliseconds: 150));
    }
  }
}`,
    impact: 'Zero thermal printer freezes during live rush hours; 100% order ticket delivery verification.',
  },
  {
    id: 'hive-cache-desync',
    caseNumber: '#003',
    title: 'The Case of the Phantom Hive Overwrite',
    alias: 'The Blind Sync Regression',
    project: 'FitPassio Gym App',
    subsystem: 'Hive NoSQL Local Storage',
    category: 'state-cache',
    severity: 'HIGH',
    dateEliminated: 'Dec 2024',
    status: 'ELIMINATED',
    storySummary:
      'Consultation notes written while offline disappeared when the device reconnected to Wi-Fi. The background cloud sync wiped recent offline user entries with outdated server state.',
    incident:
      'Gym members edited workout notes offline in FitPassio. When network returned, a sync worker ran a blanket `GET /records` and blind `await box.putAll(remoteRecords)`. Server snapshots lacked offline edits, so Hive cache overwrote local notes with stale cloud data.',
    culprit:
      'Lacking entity revision hashing and dirty-mutation tracking in the Hive repository layer. The sync engine assumed server state was unconditionally superior to client state.',
    verdict:
      'Architected an Optimistic Offline Mutation Queue with Delta Reconciliation. Every record created or modified offline is stamped with a local monotonic revision ID and marked `isDirty: true`. When network reconnects, dirty local records are pushed upstream first; server records are merged using Last-Write-Wins with field-level conflict resolution before committing to the Hive box.',
    rule: 'In offline-first architecture, never treat server payloads as unconditionally truthy without delta arbitration.',
    codeSnippet: `// Hive Transactional Delta Reconciliation
Future<void> reconcileRecords(Box<PatientRecord> box, List<PatientRecord> remote) async {
  final dirtyLocal = box.values.where((r) => r.isDirty).toList();

  // 1. Flush local mutations upstream first
  for (final local in dirtyLocal) {
    await remoteApi.pushDelta(local);
    local.isDirty = false;
    await box.put(local.id, local);
  }

  // 2. Safely merge remote entries with revision checks
  for (final incoming in remote) {
    final existing = box.get(incoming.id);
    if (existing == null || incoming.revTimestamp > existing.revTimestamp) {
      await box.put(incoming.id, incoming);
    }
  }
}`,
    impact: 'Achieved 100% data preservation during offline-to-online transitions with sub-100ms Hive queries.',
  },
  {
    id: 'websocket-tab-cascade',
    caseNumber: '#004',
    title: 'The Case of the Runaway WebSocket Storm',
    alias: 'The Quadruple Echo Cascade',
    project: 'WhatsApp CRM Web Platform',
    subsystem: 'Real-time WebSocket Manager',
    category: 'realtime-web',
    severity: 'HIGH',
    dateEliminated: 'Jan 2025',
    status: 'ELIMINATED',
    storySummary:
      'When support agents opened customer conversations in multiple browser tabs, each tab established its own WebSocket connection. Inbound customer chats caused quadruple audio chimes and duplicate message notifications.',
    incident:
      'Customer support agents frequently duplicate browser tabs to compare client histories. Each open tab instantiated a separate React hook `useWebSocket(url)`. For an agent with 5 tabs, 5 persistent WebSocket pipes were held open to the Node.js backend. Inbound messages broadcasted across all 5 connections, causing five simultaneous sound alerts, 5x server connection overhead, and out-of-order local state mutations.',
    culprit:
      'Absence of cross-tab communication coordination. Each React tab operated as an isolated silo unaware of neighboring tabs in the same browser session.',
    verdict:
      'Implemented Cross-Tab Leader Election via the `BroadcastChannel` API. The first open tab claims the "Leader" role and maintains the single authoritative WebSocket link. Non-leader tabs register as "Subscribers" and receive messages via BroadcastChannel IPC. If the leader tab closes, remaining tabs elect a new leader within 150ms without disrupting chat state.',
    rule: 'Never duplicate socket connections across browser tabs when BroadcastChannel can multiplex them seamlessly.',
    codeSnippet: `// Cross-Tab WebSocket Leader Election
const channel = new BroadcastChannel('crm_socket_sync');
let isLeader = false;

function electLeader() {
  channel.postMessage({ type: 'PING_LEADER' });
  const timer = setTimeout(() => {
    // No leader responded within 120ms; assume leadership
    claimLeadership();
  }, 120);

  channel.onmessage = (event) => {
    if (event.data.type === 'LEADER_ALIVE') clearTimeout(timer);
    if (event.data.type === 'CHAT_EVENT') dispatchToStore(event.data.payload);
  };
}

function claimLeadership() {
  isLeader = true;
  const socket = new WebSocket(WS_URL);
  socket.onmessage = (msg) => {
    channel.postMessage({ type: 'CHAT_EVENT', payload: JSON.parse(msg.data) });
  };
}`,
    impact: 'Reduced server WebSocket connection count by 68% and eliminated 100% of duplicate audio notifications.',
  },
  {
    id: 'gps-drift-urban',
    caseNumber: '#005',
    title: 'The Case of the Teleporting GPS Pin',
    alias: 'The 800-Meter Concrete Drift',
    project: 'Maps / Delivery Tracking',
    subsystem: 'Geolocation Sensor Pipeline',
    category: 'hardware-mobile',
    severity: 'MEDIUM',
    dateEliminated: 'Feb 2025',
    status: 'ELIMINATED',
    storySummary:
      'Civic complaint photos taken inside high-density residential concrete apartments placed garbage and road grievance pins up to 1.2 kilometers away at a nearby cell tower.',
    incident:
      'During field testing in multi-story urban housing, GPS satellite signals were blocked by reinforced concrete. The OS fell back to coarse cell-tower / Wi-Fi triangulation. The app took the first `Position` without checking accuracy, so pins landed ~1.2km off.',
    culprit:
      'Accepting unverified raw single-shot GPS coordinates without an accuracy gating threshold or multi-sample filtering.',
    verdict:
      'Constructed a Geofence Accuracy Gate & Moving Average Kalman Filter. The app subscribes to continuous location streams, rejecting any fix with `horizontalAccuracy > 20 meters`. If the GPS cannot achieve < 20m within 5 seconds, the app prompts the user to verify the location on an interactive satellite map before allowing ticket dispatch.',
    rule: 'Raw mobile GPS is inherently noisy. Never store a location stamp without evaluating its confidence radius.',
    codeSnippet: `// Flutter Geolocator Stream Accuracy Gate
Stream<Position> getVerifiedPositionStream() {
  return Geolocator.getPositionStream(
    locationSettings: const LocationSettings(
      accuracy: LocationAccuracy.bestForNavigation,
      distanceFilter: 2,
    ),
  ).where((position) {
    // Discard coarse cellular / wifi approximations
    return position.accuracy <= 20.0;
  }).take(3); // Gather 3 high-confidence samples to average
}`,
    impact: 'Location precision improved for live map tracking under noisy GPS conditions.',
  },
  {
    id: 'signature-bezier-nan',
    caseNumber: '#006',
    title: 'The Case of the Vanishing Parental Signature',
    alias: 'The Blank Consent Mystery',
    project: 'DigiSlips Paperless Consent Platform',
    subsystem: 'Touch Canvas & Cryptographic Sealing',
    category: 'state-cache',
    severity: 'MEDIUM',
    dateEliminated: 'Mar 2025',
    status: 'ELIMINATED',
    storySummary:
      'Parents signing school excursion permission slips on low-cost Android phones occasionally generated blank PDFs with missing signatures, invalidating legal consent.',
    incident:
      'On budget mobile devices with low touchscreen sampling rates (60Hz) and high CPU load, rapid finger strokes caused dropped pointer move events. The signature rendering algorithm attempted to calculate Catmull-Rom cubic Bezier curves between identical or null adjacent coordinates. This produced `NaN` control points, causing the SVG stroke generation to fail silently and exporting an empty transparent signature image to the cryptographic PDF pipeline.',
    culprit:
      'Lack of input sanitization and zero-distance coordinate protection in the custom Bezier smoothing algorithm during high-velocity touch inputs.',
    verdict:
      'Rebuilt the touch path pipeline with Distance Thresholding and Fallback Line Segments. Coincident points (< 1.5px distance) are deduplicated. If curve calculation encounters collinear points, it falls back to clean linear interpolation. Added a post-render stroke count and bounding box validator before permitting cryptographic signing.',
    rule: 'Hardware input streams drop frames. Always sanitize mathematical inputs to geometric curve engines.',
    codeSnippet: `// Touch Path Sanitizer & Stroke Validator
function addSignaturePoint(points, newPoint) {
  if (points.length === 0) return [newPoint];
  const lastPoint = points[points.length - 1];
  const distance = Math.hypot(newPoint.x - lastPoint.x, newPoint.y - lastPoint.y);

  // Filter out identical dropped/duplicate hardware coords
  if (distance < 1.5) return points;

  return [...points, newPoint];
}

function validateSignatureContent(canvas) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const hasDrawnPixels = imgData.data.some((channel, idx) => idx % 4 === 3 && channel > 0);
  if (!hasDrawnPixels) throw new Error("Signature canvas contains zero visible ink.");
}`,
    impact: 'Zero blank signature slips recorded across 1,200+ generated digital school consent forms.',
  },
];
