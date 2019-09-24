export namespace mastodonentities {

  export interface Application {

  }

  export interface Account {
    // The ID of the account
    id: string
    // The username of the account
    username: string
    // Equals username for local users, includes @domain for remote ones
    acct: string
    // The account's display name
    display_name: string
    // Boolean for when the account cannot be followed without waiting for approval first
    locked: string
    // The time the account was created
    created_at: string
    // The number of followers for the account
    followers_count: string
    // The number of accounts the given account is following
    following_count: string
    // The number of statuses the account has made
    statuses_count: string
    // Biography of user
    note: string
    // URL of the user's profile page (can be remote)
    url: string
    // URL to the avatar image
    avatar: string
    // URL to the avatar static image (gif)
    avatar_static: string
    // URL to the header image
    header: string
    // URL to the header static image (gif)
    header_static: string
    // Array of Emoji in account username and note
    emojis: Array<string>
    // If the owner decided to switch accounts, new account is in this attribute
    moved?: any
    // Array of profile metadata field, each element has 'name' and 'value'
    fields?: Array<any>
    // Boolean to indicate that the account performs automated actions
    bot?: boolean
  }

  export interface AuthenticatedAccount extends Account {
    source: {
      // Selected preference: Default privacy of new toots
      privacy: string
      // Selected preference: Mark media as sensitive by default?
      sensitive: boolean
      // Plain-text version of the account's note
      note: string
      // Array of profile metadata, each element has 'name' and 'value'
      fields: Array<any>
    }
  }

  export interface Status {
    // The ID of the status
    id: string
    // A Fediverse-unique resource ID
    uri: string
    // URL to the status page (can be remote)
    url?: string
    // The Account which posted the status
    account: Account
    // null or the ID of the status it replies to
    // in_reply_to_id and in_reply_to_account_id are null if the status that is replied to is unknown
    in_reply_to_id?: string
    // null or the ID of the account it replies to
    in_reply_to_account_id?: string
    // null or the reblogged Status
    reblog?: Status
    // Body of the status; this will contain HTML (remote HTML already sanitized)
    content: string
    // The time the status was created
    created_at: string
    // An array of Emoji
    emojis: Array<Emoji>
    // The number of replies for the status
    replies_count: number
    // The number of reblogs for the status
    reblogs_count: number
    // The number of favourites for the status
    favourites_count: number
    // Whether the authenticated user has reblogged the status
    reblogged?: boolean
    // Whether the authenticated user has favourited the status
    favourited?: boolean
    // Whether the authenticated user has muted the conversation this status from
    muted?: boolean
    // Whether media attachments should be hidden by default
    // NOTE: When spoiler_text is present, sensitive is true
    sensitive?: boolean
    // If not empty, warning text that should be displayed before the actual content
    spoiler_text: string
    // One of: public, unlisted, private, direct
    visibility: string
    // An array of Attachments
    media_attachments: Array<Attachment>
    // An array of Mentions
    mentions: Array<Mention>
    // An array of Tags
    tags: Array<Tag>
    // Application from which the status was posted
    application?: Application
    // The detected language for the status, if detected
    language?: string
    // Whether this is the pinned status for the account that posted it
    pinned?: boolean
    // for pawoo, pixiv_cards info
    pixiv_cards?: Array<{ image_url: string, url: string }>
  }

  export interface Context {
    ancestors: Array<Status>
    descendants: Array<Status>
  }

  export interface Emoji {

  }

  export interface Attachment {
    // ID of the attachment
    id: string
    // One of: "image", "video", "gifv", "unknown"
    type: "image" | "video" | "gifv" | "unknown"
    // URL of the locally hosted version of the image
    url: string
    // For remote images, the remote URL of the original image
    remote_url?: string
    // URL of the preview image
    preview_url: string
    // Shorter URL for the image, for insertion into text (only present on local images)
    text_url?: string
    /**
     * May contain small and original (referring to the preview and the original file).
     * Images may contain width, height, size, aspect,
     * while videos (including GIFV) may contain width, height,
     * frame_rate, duration and bitrate. There may be another top-level object,
     * focus with the coordinates x and y.
     * These coordinates can be used for smart thumbnail cropping
     **/
    meta?: ImageMeta | GifvMeta
    // A description of the image for the visually impaired (maximum 420 characters), or null if none provided
    description?: string
  }

  interface ImageSizeMetaItem {
    aspect: number
    width: number
    height: number
    size: string
  }

  export interface ImageMeta {
    focus: { x: number, y: number }
    original: ImageSizeMetaItem
    small: ImageSizeMetaItem
  }

  export interface GifvMeta extends ImageSizeMetaItem {
    duration: number
    fps: number
    length: string
    original: {
      bitrate: number
      duration: number
      frame_rate: string
      height: number
      width: number
    }
    small: ImageSizeMetaItem
  }

  export interface Mention {
    // URL of user's profile (can be remote)
    url: string
    // The username of the account
    username: string
    // Equals username for local users, includes @domain for remote ones
    acct: string
    // Account ID
    id: string
  }

  export interface Tag {

  }

  export interface Notification {
    // The notification ID
    id: string
    // One of: "mention", "reblog", "favourite", "follow"
    type: NotificationType
    // The time the notification was created
    created_at: string
    // The Account sending the notification to the user
    account: Account
    // The Status associated with the notification, if applicable
    status?: Status
  }

  export type NotificationType = "mention" | "reblog" | "favourite" | "follow"

  export interface SearchResults {
    accounts: Array<Account>
    statuses: Array<Status>
    hashtags: Array<string>
  }

  export interface Emoji {
    // The shortcode of the emoji
    shortcode: string
    // URL to the emoji static image
    static_url: string
    // URL to the emoji image
    url: string
    // that indicates if the emoji is visible in picker
    visible_in_picker: boolean
  }

  export interface Relationship {
    // Target account id
    id: string
    // Whether the user is currently following the account
    following: boolean
    // Whether the user is currently being followed by the account
    followed_by: boolean
    // Whether the user is currently blocking the account
    blocking: boolean
    // Whether the user is currently muting the account
    muting: boolean
    // Whether the user is also muting notifications	no
    muting_notifications: boolean
    // Whether the user has requested to follow the account
    requested: boolean
    // Whether the user is currently blocking the accounts's domain
    domain_blocking: boolean
    // Whether the user's reblogs will show up in the home timeline
    showing_reblogs: boolean
    // Whether the user is currently endorsing the account
    endorsed: boolean
  }

  export interface Card {
    // The url associated with the card
    url: string
    // The title of the card
    title: string
    // The card description
    description: string
    // The image associated with the card, if any	yes
    image: string
    // "link", "photo", "video", or "rich"
    type: string
    // OEmbed data
    author_name: string
    // OEmbed data
    author_url: string
    // OEmbed data	yes
    provider_name: string
    // OEmbed data	yes
    provider_url: string
    // OEmbed data	yes
    html: string
    // OEmbed data	yes
    width: number
    // OEmbed data
    height: number
  }
}
