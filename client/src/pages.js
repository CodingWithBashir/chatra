function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const SETTINGS_SECTIONS = {
  account: [
    'Display name','Username','Email addresses','Phone number','Date of birth privacy','Nickname',
    'Profile picture','Cover image','Bio','Links','Location visibility','Language of account',
    'Country of residence','Close friends list','Account switching','Delegate access',
    'Professional account','Creator account conversion','Student status','Occupation privacy',
    'Income privacy','Education privacy','Deactivate account','Download archive','Merge accounts',
    'Pronouns privacy','Website link','Pinned highlight','Profile layout','Inactive account timeout',
  ],
  privacy: [
    'Who can follow me','Who can message me','Message requests','Who can mention me','Who can comment',
    'Who can quote me','Who can remix','Who can download','Like visibility','Dislike visibility',
    'Following list visibility','Followers list visibility','Search visibility','Profile discoverability',
    'Activity status','Read receipts','Last seen','Online indicator','Personalized recommendations',
    'Personalized ads','Data sharing partners','Off-Chatra activity','Mute words','Hidden words',
    'Sensitive content','Restricted accounts','Blocked accounts','Muted accounts',
    'Story replies','Story sharing','Live guest invites','Tag review','Photo tagging',
  ],
  security: [
    'Password','Two-factor authentication','Passkeys','Recovery codes','Login alerts',
    'Email alerts','SMS alerts','Device management','Active sessions','Suspicious login detection',
    'App passwords','Connected apps','OAuth grants','API tokens','Login history',
    'Trusted devices','New device challenge','CAPTCHA preference','Anti-phishing codes',
    'Session length','Remote logout all','Backup email','Hardware keys',
  ],
  notifications: [
    'Push notifications','Email notifications','SMS notifications','In-app badges',
    'Likes','Dislikes','Comments','Replies','Mentions','Reposts','Follows','Live starts',
    'Channel posts','Community posts','Messages','Message requests','Security alerts',
    'Product announcements','Creator tips','Digest frequency','Quiet hours','Mute live alerts',
  ],
  feed: [
    'For You defaults','Following defaults','Latest defaults','Media tab','Videos tab','Channels tab',
    'Reduce similar content','Content diversity','Sensitive media','Autoplay videos','Autoplay sounds',
    'Data saver','Low bandwidth mode','Infinite scroll','Pagination size','Why am I seeing this',
    'Not interested history','Muted topics','Blocked topics','Followed topics','Hidden hashtags',
  ],
  messaging: [
    'Who can add me to groups','Group invite links','Read receipts DMs','Typing indicator',
    'Disappearing messages default','Chat themes','Custom wallpapers','Archived chats',
    'Pinned chats','Media auto-download','Voice message quality','Video call quality',
    'Screen sharing permission','Forwarding limits','Save media to device',
  ],
  accessibility: [
    'Font size','High contrast','Reduced motion','Screen reader hints','Keyboard shortcuts',
    'Captions default','Caption size','Alt text prompts','Focus indicators','Color filters',
    'Dyslexia-friendly font','Haptic feedback','Sound effects','Animation speed',
  ],
  language: [
    'App language','Content languages','Translation','Auto-translate posts','Search language',
    'Moderation language','Notification language','Kinyarwanda','English','French','Swahili','Arabic',
  ],
  data: [
    'Download my data','Download media','Download messages','Download following',
    'Cookie preferences','Analytics opt-out','Ad topics','Off-platform tracking','Account deletion request',
    'Grace period','Legal hold notice','Export format JSON','Export format HTML',
  ],
  verification: [
    'Blue tick','White tick','Gold tick','Plan comparison','Billing cycle','Invoices',
    'Payment method','Distribution eligibility explainer','Cancel plan','Restore plan',
  ],
}

const STUDIO_SECTIONS = {
  dashboard: [
    'Overview','Realtime','Today','Yesterday','Last 7 days','Last 28 days','Last 90 days','Year to date',
    'Custom range','Goals','Alerts','Snapshots','Hourly pulse','Creator score privacy',
  ],
  content: [
    'All videos','Posts','Shorts','Reels','Live streams','Drafts','Scheduled','Playlists',
    'Stories archive','Articles','Voice posts','Polls','Events','Collaborations','Remixes','Clips',
  ],
  analytics: [
    'Views','Unique viewers','Watch time','Average view duration','Impressions','CTR',
    'Traffic sources','Search traffic','Recommendation traffic','External traffic','Direct',
    'Retention graph','Audience retention','End screens','Cards','Hashtag performance',
    'Keyword performance','Device mix','Country mix','Language mix','New vs returning',
    'Age bands','Follows from content','Unfollows after content','Likes ratio','Dislikes ratio',
    'Comments velocity','Shares','Saves','Reposts','Profile visits from content',
  ],
  audience: [
    'Overview','Geography','Languages','Devices','Operating systems','Returning viewers',
    'New viewers','Subscribed vs not','Peak hours','Peak days','Communities overlap',
  ],
  monetization: [
    'Coming soon','Eligibility','Ad formats placeholder','Channel memberships placeholder',
    'Super thanks placeholder','Payouts placeholder','Tax info placeholder','Thresholds',
  ],
  copyright: [
    'Claims','Matches','Disputes','Appeals','Music library','Sound library','Reuse policy',
    'Repeat infringer status','Content ID analog','Fair use notes',
  ],
  community: [
    'Comments','Held for review','Likely spam','Likely harassment','Blocked words',
    'Auto-moderation','Moderators','Moderator audit','Member questions','Community posts',
  ],
  live: [
    'Stream keys','Latency mode','Multi-camera','Guest slots','Prerecorded live','DVR',
    'Chat mode','Slow mode','Subscribers-only chat','VODs','Clips from live','Moderators live',
  ],
  customization: [
    'Channel name','Channel username','Channel bio','Keywords','Category','Links',
    'Watermark','Trailer','Featured video','Home layout','Branding colors','Banner',
    'Profile image','Trailer for unsubscribed',
  ],
  publishing: [
    'Upload defaults','Default audience','Default comments','Default remix','Default download',
    'Default captions language','Default location','Default category','Default playlist',
    'End screen template','Cards template','Chapters template','Premiere defaults',
  ],
  tools: [
    'Bulk editor','CSV export','Content calendar','Scheduling assistant','Thumbnail A/B',
    'Title experiments','Description templates','Hashtag packs','Mention packs','Copyright check',
    'Subtitle upload','Chapters editor','Endscreen library','Card library','Localization tracks',
    'Team permissions','Editor invites','Owner transfer','Channel analytics export',
    'Community tab','Memberships placeholder','Store placeholder','Donations placeholder',
    'Premiere scheduler','Shorts drafts','Clip miner','Highlight reel','Audio replace',
    'Loudness normalize','Intro bumper','Outro bumper','Lower thirds','Watermark position',
  ],
}

const OTHER = [
  ['/explore/trending', 'Trending'],
  ['/explore/topics', 'Topics'],
  ['/explore/videos', 'Explore videos'],
  ['/explore/channels', 'Explore channels'],
  ['/explore/articles', 'Explore articles'],
  ['/explore/live', 'Live now'],
  ['/explore/communities', 'Explore communities'],
  ['/notifications/mentions', 'Mentions'],
  ['/notifications/system', 'System alerts'],
  ['/notifications/followers', 'New followers'],
  ['/bookmarks/programming', 'Folder · Programming'],
  ['/bookmarks/movies', 'Folder · Movies'],
  ['/bookmarks/ideas', 'Folder · Ideas'],
  ['/communities/javascript', 'JavaScript Developers'],
  ['/communities/africa', 'African Developers'],
  ['/legal/copyright', 'Copyright Policy'],
  ['/legal/verification', 'Verification Policy'],
  ['/legal/spam', 'Spam Policy'],
  ['/legal/manipulation', 'Platform Manipulation Policy'],
  ['/legal/payments', 'Payment Terms'],
  ['/legal/creator', 'Creator Policy'],
  ['/legal/api', 'API Terms'],
  ['/legal/live', 'Live streaming policy'],
  ['/legal/cookies', 'Cookie policy'],
  ['/developers', 'Chatra Developers'],
  ['/developers/oauth', 'OAuth'],
  ['/developers/webhooks', 'Webhooks'],
  ['/developers/bots', 'Bots'],
  ['/status', 'System status'],
  ['/careers', 'Careers'],
  ['/press', 'Press'],
  ['/brand', 'Brand kit'],
  ['/safety', 'Safety center'],
  ['/research', 'Research'],
  ['/transparency', 'Transparency report'],
  ['/elections', 'Civic integrity'],
  ['/kids', 'Youth safety'],
  ['/ads', 'Ads coming soon'],
  ['/about', 'About Chatra'],
  ['/contact', 'Contact'],
]

function expand(prefix, sections) {
  const out = []
  for (const [group, items] of Object.entries(sections)) {
    items.forEach((title, i) => {
      out.push({
        path: `${prefix}/${group}/${slug(title) || i}`,
        title,
        group,
        area: prefix.replace('/', ''),
      })
    })
  }
  return out
}

export const SETTINGS_PAGES = expand('/settings', SETTINGS_SECTIONS)
export const STUDIO_PAGES = expand('/studio', STUDIO_SECTIONS)
export const OTHER_PAGES = OTHER.map(([path, title]) => ({ path, title, group: 'site', area: 'site' }))

export const EXTRA_PAGES = [...SETTINGS_PAGES, ...STUDIO_PAGES, ...OTHER_PAGES]

export function pagesByArea(area) {
  return EXTRA_PAGES.filter(p => p.area === area)
}
