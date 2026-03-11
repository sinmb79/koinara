const LOCALE = document.body?.dataset?.locale || "en";
const SNAPSHOT_URL = document.body?.dataset?.snapshot || "./live/worldland-v2-snapshot.json";
const LOCALE_CODE = {
  en: "en-US",
  ko: "ko-KR",
  zh: "zh-CN"
}[LOCALE] || "en-US";

const TEXT = {
  en: {
    invalidJobId: "Enter a valid job id.",
    invalidAddress: "Enter a valid wallet address.",
    missingSnapshot: "Scan snapshot is unavailable right now.",
    loadingJob: "Loading job",
    loadingNode: "Loading node",
    noSubmissionYet: "No submission yet",
    notSubmitted: "Not submitted",
    noneYet: "None yet",
    notFinalized: "Not finalized",
    noRewardYet: "Job not yet recorded for work-reward settlement",
    noClosedEpoch: "No closed epoch yet",
    noActiveShare: "No active share yet",
    notRegistered: "Not registered",
    unset: "Unset",
    yes: "yes",
    no: "no",
    na: "n/a",
    tokenSupply: "token supply",
    nextClose: "Next close",
    activeOnly: "Current active nodes only. Active pool this epoch",
    activeSummary: "Current epoch active {current} / last closed epoch {epoch} had {count}",
    currentWorkPool: "Current work pool",
    currentWorkSummary: "Current work pool {pool} / last closed accepted weight {weight}",
    openEpochNote: "Epoch 0 is still open. Claimable KOIN appears only after the first epoch closes.",
    closedEpochNote: "Epoch {epoch} is closed. Claim transactions can now mint any accrued rewards for that epoch.",
    snapshotUpdated: "Snapshot updated",
    unknownJob: "This snapshot does not include that job yet.",
    unknownNode: "This snapshot does not include that address yet.",
    labels: {
      state: "State",
      jobType: "Job type",
      creator: "Creator",
      requestHash: "Request hash",
      schemaHash: "Schema hash",
      deadline: "Deadline",
      premium: "Premium",
      submission: "Submission",
      provider: "Provider",
      submittedAt: "Submitted at",
      approvals: "Approvals",
      approvedVerifiers: "Approved verifiers",
      verificationFlags: "Verification flags",
      poiHash: "PoI hash",
      rewardBreakdown: "Reward breakdown",
      address: "Address",
      role: "Role",
      registered: "Registered",
      metadataHash: "Metadata hash",
      nodeActiveFlag: "Node active flag",
      currentEpochActive: "Current epoch active",
      lastHeartbeatEpoch: "Last heartbeat epoch",
      latestClosedEpochStatus: "Latest closed epoch status",
      nativeBalance: "Native balance",
      koinBalance: "KOIN balance",
      estimatedLatestActiveShare: "Estimated latest active share"
    },
    flags: {
      validJob: "Valid job",
      withinDeadline: "Within deadline",
      formatPass: "Format pass",
      nonEmptyResponse: "Non-empty",
      verificationPass: "Verification pass",
      finalized: "Finalized",
      rejected: "Rejected"
    },
    premiumSuffix: "market-funded",
    rewardTotal: "Total",
    rewardProvider: "Provider",
    rewardVerifier: "Verifier set",
    closedEpochStatus: "Epoch {epoch}: {status}",
    stateFallback: "State",
    typeFallback: "Type",
    roleFallback: "Role"
  },
  ko: {
    invalidJobId: "유효한 job id를 입력하세요.",
    invalidAddress: "유효한 지갑 주소를 입력하세요.",
    missingSnapshot: "지금은 scan snapshot을 읽을 수 없습니다.",
    loadingJob: "job 불러오는 중",
    loadingNode: "노드 불러오는 중",
    noSubmissionYet: "아직 제출이 없습니다",
    notSubmitted: "아직 제출되지 않음",
    noneYet: "아직 없음",
    notFinalized: "아직 finalize되지 않음",
    noRewardYet: "아직 work reward 정산 대상이 아닙니다",
    noClosedEpoch: "아직 닫힌 epoch가 없습니다",
    noActiveShare: "아직 active share가 없습니다",
    notRegistered: "등록되지 않음",
    unset: "설정되지 않음",
    yes: "예",
    no: "아니오",
    na: "없음",
    tokenSupply: "토큰 총공급",
    nextClose: "다음 epoch 종료",
    activeOnly: "현재 epoch 활성 노드만 확인됩니다. 이번 epoch active pool",
    activeSummary: "현재 epoch 활성 {current} / 직전 종료 epoch {epoch} 활성 {count}",
    currentWorkPool: "현재 work pool",
    currentWorkSummary: "현재 work pool {pool} / 직전 종료 epoch accepted weight {weight}",
    openEpochNote: "Epoch 0이 아직 열려 있습니다. 첫 epoch가 닫힌 뒤에만 claim 가능한 KOIN이 생깁니다.",
    closedEpochNote: "Epoch {epoch}가 종료되었습니다. 이제 claim 트랜잭션으로 해당 epoch 보상을 민팅할 수 있습니다.",
    snapshotUpdated: "스냅샷 생성 시각",
    unknownJob: "이 snapshot에는 해당 job이 아직 없습니다.",
    unknownNode: "이 snapshot에는 해당 주소가 아직 없습니다.",
    labels: {
      state: "상태",
      jobType: "job 유형",
      creator: "생성자",
      requestHash: "요청 해시",
      schemaHash: "스키마 해시",
      deadline: "마감 시각",
      premium: "프리미엄",
      submission: "제출",
      provider: "provider",
      submittedAt: "제출 시각",
      approvals: "승인 수",
      approvedVerifiers: "승인 verifier",
      verificationFlags: "검증 플래그",
      poiHash: "PoI 해시",
      rewardBreakdown: "보상 분해",
      address: "주소",
      role: "역할",
      registered: "등록 시각",
      metadataHash: "메타데이터 해시",
      nodeActiveFlag: "노드 active 플래그",
      currentEpochActive: "현재 epoch active",
      lastHeartbeatEpoch: "마지막 heartbeat epoch",
      latestClosedEpochStatus: "최근 종료 epoch 상태",
      nativeBalance: "네이티브 잔액",
      koinBalance: "KOIN 잔액",
      estimatedLatestActiveShare: "최근 종료 epoch 예상 active share"
    },
    flags: {
      validJob: "유효한 job",
      withinDeadline: "마감 내 제출",
      formatPass: "형식 통과",
      nonEmptyResponse: "비어 있지 않음",
      verificationPass: "검증 통과",
      finalized: "finalize 완료",
      rejected: "거절됨"
    },
    premiumSuffix: "시장 보상",
    rewardTotal: "총액",
    rewardProvider: "provider",
    rewardVerifier: "verifier 집합",
    closedEpochStatus: "Epoch {epoch}: {status}",
    stateFallback: "상태",
    typeFallback: "유형",
    roleFallback: "역할"
  },
  zh: {
    invalidJobId: "请输入有效的 job id。",
    invalidAddress: "请输入有效的钱包地址。",
    missingSnapshot: "当前无法读取 scan snapshot。",
    loadingJob: "正在读取 job",
    loadingNode: "正在读取节点",
    noSubmissionYet: "暂无提交",
    notSubmitted: "尚未提交",
    noneYet: "暂无",
    notFinalized: "尚未 finalize",
    noRewardYet: "尚未进入 work reward 结算",
    noClosedEpoch: "尚无已关闭 epoch",
    noActiveShare: "暂无 active share",
    notRegistered: "未注册",
    unset: "未设置",
    yes: "是",
    no: "否",
    na: "无",
    tokenSupply: "代币总量",
    nextClose: "下个 epoch 结束时间",
    activeOnly: "当前只能看到本 epoch 活跃节点。本 epoch active pool",
    activeSummary: "当前 epoch 活跃 {current} / 上个已结束 epoch {epoch} 活跃 {count}",
    currentWorkPool: "当前 work pool",
    currentWorkSummary: "当前 work pool {pool} / 上个已结束 epoch accepted weight {weight}",
    openEpochNote: "Epoch 0 仍然开放。只有第一个 epoch 结束后才会出现可 claim 的 KOIN。",
    closedEpochNote: "Epoch {epoch} 已关闭。现在可以通过 claim 交易铸造该 epoch 的奖励。",
    snapshotUpdated: "快照生成时间",
    unknownJob: "该 snapshot 尚未包含这个 job。",
    unknownNode: "该 snapshot 尚未包含这个地址。",
    labels: {
      state: "状态",
      jobType: "job 类型",
      creator: "创建者",
      requestHash: "请求哈希",
      schemaHash: "Schema 哈希",
      deadline: "截止时间",
      premium: "Premium",
      submission: "提交",
      provider: "provider",
      submittedAt: "提交时间",
      approvals: "批准数",
      approvedVerifiers: "已批准 verifier",
      verificationFlags: "验证标记",
      poiHash: "PoI 哈希",
      rewardBreakdown: "奖励拆分",
      address: "地址",
      role: "角色",
      registered: "注册时间",
      metadataHash: "元数据哈希",
      nodeActiveFlag: "节点 active 标记",
      currentEpochActive: "当前 epoch active",
      lastHeartbeatEpoch: "最后 heartbeat epoch",
      latestClosedEpochStatus: "最近关闭 epoch 状态",
      nativeBalance: "原生余额",
      koinBalance: "KOIN 余额",
      estimatedLatestActiveShare: "最近关闭 epoch 预计 active share"
    },
    flags: {
      validJob: "有效 job",
      withinDeadline: "在时限内",
      formatPass: "格式通过",
      nonEmptyResponse: "非空响应",
      verificationPass: "验证通过",
      finalized: "已 finalize",
      rejected: "已拒绝"
    },
    premiumSuffix: "市场支付",
    rewardTotal: "总计",
    rewardProvider: "provider",
    rewardVerifier: "verifier 集合",
    closedEpochStatus: "Epoch {epoch}: {status}",
    stateFallback: "状态",
    typeFallback: "类型",
    roleFallback: "角色"
  }
}[LOCALE];

const JOB_STATES = {
  en: ["Created", "Open", "Submitted", "Under verification", "Accepted", "Rejected", "Settled", "Expired"],
  ko: ["생성됨", "열림", "제출됨", "검증 중", "승인됨", "거절됨", "정산 완료", "만료"],
  zh: ["已创建", "开放中", "已提交", "验证中", "已接受", "已拒绝", "已结算", "已过期"]
}[LOCALE];

const JOB_TYPES = ["Simple", "General", "Collective"];
const NODE_ROLES = {
  en: ["Provider", "Verifier", "Both"],
  ko: ["Provider", "Verifier", "둘 다"],
  zh: ["Provider", "Verifier", "两者"]
}[LOCALE];

const snapshotEls = {
  network: document.getElementById("snapshot-network"),
  rpc: document.getElementById("snapshot-rpc"),
  epoch: document.getElementById("snapshot-epoch"),
  nextClose: document.getElementById("snapshot-next-close"),
  active: document.getElementById("snapshot-active"),
  activeDetail: document.getElementById("snapshot-active-detail"),
  jobs: document.getElementById("snapshot-jobs"),
  workPool: document.getElementById("snapshot-work-pool"),
  note: document.getElementById("snapshot-note")
};

const jobResultEl = document.getElementById("job-result");
const nodeResultEl = document.getElementById("node-result");

let scanData = null;

document.getElementById("job-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const jobId = Number(document.getElementById("job-id")?.value || 0);
  if (!Number.isFinite(jobId) || jobId <= 0) {
    renderError(jobResultEl, TEXT.invalidJobId);
    return;
  }
  loadJob(jobId);
});

document.getElementById("node-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const address = String(document.getElementById("node-address")?.value || "").trim();
  if (!isAddress(address)) {
    renderError(nodeResultEl, TEXT.invalidAddress);
    return;
  }
  loadNode(address);
});

document.getElementById("load-canary-job")?.addEventListener("click", () => {
  const input = document.getElementById("job-id");
  if (input) {
    input.value = "1";
  }
  loadJob(1);
});

document.getElementById("load-provider")?.addEventListener("click", () => {
  const input = document.getElementById("node-address");
  if (input && scanData?.jobs?.["1"]?.submission?.provider) {
    input.value = scanData.jobs["1"].submission.provider;
  }
  loadNode(input?.value || "");
});

document.getElementById("load-verifier")?.addEventListener("click", () => {
  const verifierAddress = scanData?.jobs?.["1"]?.approvedVerifiers?.[0] || "";
  const input = document.getElementById("node-address");
  if (input) {
    input.value = verifierAddress;
  }
  loadNode(verifierAddress);
});

void loadSnapshot();

async function loadSnapshot() {
  try {
    const response = await fetch(SNAPSHOT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    scanData = await response.json();
    renderContracts(scanData.contracts, scanData.source.explorerBaseUrl);
    renderSummary(scanData);
    loadJob(1);
    const defaultAddress =
      scanData.jobs?.["1"]?.submission?.provider ||
      Object.keys(scanData.nodes || {})[0] ||
      "";
    if (defaultAddress) {
      const input = document.getElementById("node-address");
      if (input) {
        input.value = defaultAddress;
      }
      loadNode(defaultAddress);
    }
  } catch (error) {
    renderError(snapshotEls.note, `${TEXT.missingSnapshot} ${formatError(error)}`);
    renderError(jobResultEl, TEXT.missingSnapshot);
    renderError(nodeResultEl, TEXT.missingSnapshot);
  }
}

function renderSummary(data) {
  const { source, summary, generatedAt } = data;

  snapshotEls.network.textContent = source.label;
  snapshotEls.rpc.textContent = `${source.rpcUrl} / ${TEXT.tokenSupply} ${formatAmount(summary.totalSupplyFormatted)} KOIN`;
  snapshotEls.epoch.textContent = `Epoch ${summary.currentEpoch}`;
  snapshotEls.nextClose.textContent = `${TEXT.nextClose}: ${formatTimestamp(summary.nextCloseTimestamp)}`;
  snapshotEls.active.textContent = String(summary.currentActiveCount);
  snapshotEls.activeDetail.textContent =
    summary.lastClosedEpoch == null
      ? `${TEXT.activeOnly}: ${formatAmount(summary.currentActiveEmissionFormatted)} KOIN`
      : interpolate(TEXT.activeSummary, {
          current: String(summary.currentActiveCount),
          epoch: String(summary.lastClosedEpoch),
          count: String(summary.lastClosedActiveCount)
        });
  snapshotEls.jobs.textContent = String(summary.totalJobs);
  snapshotEls.workPool.textContent =
    summary.lastClosedEpoch == null
      ? `${TEXT.currentWorkPool}: ${formatAmount(summary.currentWorkEmissionFormatted)} KOIN`
      : interpolate(TEXT.currentWorkSummary, {
          pool: `${formatAmount(summary.currentWorkEmissionFormatted)} KOIN`,
          weight: String(summary.lastClosedAcceptedWeight)
        });
  snapshotEls.note.textContent =
    summary.lastClosedEpoch == null
      ? `${TEXT.openEpochNote} ${TEXT.snapshotUpdated}: ${formatIsoTimestamp(generatedAt)}`
      : `${interpolate(TEXT.closedEpochNote, { epoch: String(summary.lastClosedEpoch) })} ${TEXT.snapshotUpdated}: ${formatIsoTimestamp(generatedAt)}`;
}

function loadJob(jobId) {
  renderLoading(jobResultEl, `${TEXT.loadingJob} ${jobId}...`);

  if (!scanData?.jobs) {
    renderError(jobResultEl, TEXT.missingSnapshot);
    return;
  }

  const job = scanData.jobs[String(jobId)];
  if (!job) {
    renderError(jobResultEl, TEXT.unknownJob);
    return;
  }

  const submission = job.submission;
  const record = job.record;
  const rewardBreakdown = job.rewardBreakdown;
  const approvedVerifiers = job.approvedVerifiers || [];
  const jobState = JOB_STATES[job.state] ?? `${TEXT.stateFallback} ${job.state}`;
  const jobType = JOB_TYPES[job.jobType] ?? `${TEXT.typeFallback} ${job.jobType}`;
  const verificationFlags = [
    [TEXT.flags.validJob, record.validJob],
    [TEXT.flags.withinDeadline, record.withinDeadline],
    [TEXT.flags.formatPass, record.formatPass],
    [TEXT.flags.nonEmptyResponse, record.nonEmptyResponse],
    [TEXT.flags.verificationPass, record.verificationPass],
    [TEXT.flags.finalized, record.finalized],
    [TEXT.flags.rejected, record.rejected]
  ];

  jobResultEl.innerHTML = `
    <div class="scan-result-grid">
      ${renderKeyValue(TEXT.labels.state, jobState)}
      ${renderKeyValue(TEXT.labels.jobType, jobType)}
      ${renderKeyValue(TEXT.labels.creator, renderAddressLink(job.creator))}
      ${renderKeyValue(TEXT.labels.requestHash, `<code>${job.requestHash}</code>`)}
      ${renderKeyValue(TEXT.labels.schemaHash, `<code>${job.schemaHash}</code>`)}
      ${renderKeyValue(TEXT.labels.deadline, formatTimestamp(job.deadline))}
      ${renderKeyValue(TEXT.labels.premium, `${formatAmount(job.premiumRewardFormatted)} KOIN (${TEXT.premiumSuffix})`)}
      ${renderKeyValue(TEXT.labels.submission, submission.exists ? `<code>${submission.responseHash}</code>` : TEXT.noSubmissionYet)}
      ${renderKeyValue(TEXT.labels.provider, submission.exists ? renderAddressLink(submission.provider) : TEXT.notSubmitted)}
      ${renderKeyValue(TEXT.labels.submittedAt, submission.exists ? formatTimestamp(submission.submittedAt) : TEXT.na)}
      ${renderKeyValue(TEXT.labels.approvals, `${record.approvals} / quorum ${record.quorum}`)}
      ${renderKeyValue(
        TEXT.labels.approvedVerifiers,
        approvedVerifiers.length
          ? approvedVerifiers.map((address) => renderAddressLink(address)).join("<br />")
          : TEXT.noneYet
      )}
      ${renderKeyValue(
        TEXT.labels.verificationFlags,
        verificationFlags
          .map(([label, value]) => `<span class="scan-pill ${value ? "ok" : "muted"}">${label}: ${value ? TEXT.yes : TEXT.no}</span>`)
          .join(" ")
      )}
      ${renderKeyValue(TEXT.labels.poiHash, record.poiHash && !isZeroHash(record.poiHash) ? `<code>${record.poiHash}</code>` : TEXT.notFinalized)}
      ${renderKeyValue(
        TEXT.labels.rewardBreakdown,
        rewardBreakdown
          ? [
              `${TEXT.rewardTotal} ${formatAmount(rewardBreakdown.totalRewardFormatted)} KOIN`,
              `${TEXT.rewardProvider} ${formatAmount(rewardBreakdown.providerRewardFormatted)} KOIN`,
              `${TEXT.rewardVerifier} ${formatAmount(rewardBreakdown.verifierRewardTotalFormatted)} KOIN`
            ].join("<br />")
          : TEXT.noRewardYet
      )}
    </div>
  `;
}

function loadNode(address) {
  renderLoading(nodeResultEl, `${TEXT.loadingNode} ${address}...`);

  if (!scanData?.nodes) {
    renderError(nodeResultEl, TEXT.missingSnapshot);
    return;
  }

  const node = scanData.nodes[address.toLowerCase()];
  if (!node) {
    renderError(nodeResultEl, TEXT.unknownNode);
    return;
  }

  nodeResultEl.innerHTML = `
    <div class="scan-result-grid">
      ${renderKeyValue(TEXT.labels.address, renderAddressLink(node.address))}
      ${renderKeyValue(TEXT.labels.role, NODE_ROLES[node.role] ?? `${TEXT.roleFallback} ${node.role}`)}
      ${renderKeyValue(TEXT.labels.registered, node.registeredAt > 0 ? formatTimestamp(node.registeredAt) : TEXT.notRegistered)}
      ${renderKeyValue(TEXT.labels.metadataHash, node.metadataHash && !isZeroHash(node.metadataHash) ? `<code>${node.metadataHash}</code>` : TEXT.unset)}
      ${renderKeyValue(TEXT.labels.nodeActiveFlag, node.active ? TEXT.yes : TEXT.no)}
      ${renderKeyValue(TEXT.labels.currentEpochActive, node.activeCurrent ? TEXT.yes : TEXT.no)}
      ${renderKeyValue(TEXT.labels.lastHeartbeatEpoch, String(node.lastHeartbeatEpoch))}
      ${renderKeyValue(
        TEXT.labels.latestClosedEpochStatus,
        node.previousEpoch == null
          ? TEXT.noClosedEpoch
          : interpolate(TEXT.closedEpochStatus, { epoch: String(node.previousEpoch), status: node.activePrevious ? TEXT.yes : TEXT.no })
      )}
      ${renderKeyValue(TEXT.labels.nativeBalance, `${formatAmount(node.nativeBalanceFormatted)} WLC`)}
      ${renderKeyValue(TEXT.labels.koinBalance, `${formatAmount(node.tokenBalanceFormatted)} KOIN`)}
      ${renderKeyValue(
        TEXT.labels.estimatedLatestActiveShare,
        Number(node.estimatedClosedEpochShare) > 0 ? `${formatAmount(node.estimatedClosedEpochShareFormatted)} KOIN` : TEXT.noActiveShare
      )}
    </div>
  `;
}

function renderContracts(contracts, explorerBaseUrl) {
  const container = document.getElementById("contract-list");
  if (!container) {
    return;
  }

  const baseUrl = explorerBaseUrl.replace(/\/$/, "");

  container.innerHTML = Object.entries(contracts)
    .map(
      ([label, address]) => `
        <div class="scan-contract-row">
          <strong>${humanizeKey(label)}</strong>
          <a href="${baseUrl}/address/${address}" target="_blank" rel="noreferrer">${address}</a>
        </div>
      `
    )
    .join("");
}

function renderKeyValue(label, value) {
  return `
    <div class="scan-kv">
      <span class="scan-kv-label">${label}</span>
      <div class="scan-kv-value">${value}</div>
    </div>
  `;
}

function renderAddressLink(address) {
  const baseUrl = scanData.source.explorerBaseUrl.replace(/\/$/, "");
  return `<a href="${baseUrl}/address/${address}" target="_blank" rel="noreferrer">${address}</a>`;
}

function renderLoading(element, message) {
  if (element) {
    element.innerHTML = `<div class="scan-inline-note">${message}</div>`;
  }
}

function renderError(element, message) {
  if (element) {
    element.innerHTML = `<div class="scan-inline-note scan-error">${message}</div>`;
  }
}

function formatAmount(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return value;
  }

  return new Intl.NumberFormat(LOCALE_CODE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  }).format(numeric);
}

function formatTimestamp(seconds) {
  if (!seconds) {
    return TEXT.na;
  }

  return new Date(Number(seconds) * 1000).toLocaleString(LOCALE_CODE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function formatIsoTimestamp(value) {
  return new Date(value).toLocaleString(LOCALE_CODE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function humanizeKey(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function isZeroHash(value) {
  return /^0x0{64}$/i.test(value);
}

function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}
