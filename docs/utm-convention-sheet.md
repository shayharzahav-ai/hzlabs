# UTM Convention Sheet — harzahav.online

> Shared reference for all campaigns linking to `https://harzahav.online`.  
> Last updated: 2026-05-05

---

## Parameter Definitions

| Parameter | Purpose | Examples |
|-----------|---------|----------|
| `utm_source` | Where the traffic originated | `linkedin`, `google`, `email`, `whatsapp`, `partner` |
| `utm_medium` | The marketing medium | `social`, `organic`, `cpc`, `email`, `referral` |
| `utm_campaign` | The specific campaign name | `npo-outreach-q2`, `content-blog-2026`, `google-ads-ai` |
| `utm_content` | Differentiates similar content/links | `hero-cta`, `footer-link`, `carousel-slide-2` |
| `utm_term` | Keywords for paid search | `ai-development`, `nonprofit-tech`, `custom-platform` |

---

## Campaign Presets

### Organic Social
| Source | Medium | Campaign | Use For |
|--------|--------|----------|---------|
| `linkedin` | `social` | `hzlabs-profile` | Personal profile posts |
| `linkedin` | `social` | `hzlabs-company` | Company page posts |
| `linkedin` | `social` | `npo-outreach-q2` | NPO/NGO outreach content |

### Email Outreach
| Source | Medium | Campaign | Use For |
|--------|--------|----------|---------|
| `email` | `email` | `npo-cold-outreach` | Cold email to non-profits |
| `email` | `email` | `npo-followup` | Follow-up sequences |
| `email` | `email` | `newsletter` | Newsletter/updates |

### Partner Referrals
| Source | Medium | Campaign | Use For |
|--------|--------|----------|---------|
| `partner` | `referral` | `{partner-name}` | Named partner referrals |

### WhatsApp / Direct
| Source | Medium | Campaign | Use For |
|--------|--------|----------|---------|
| `whatsapp` | `social` | `direct-share` | Shared in chat |

---

## Link Builder

Template:
```
https://harzahav.online/?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}
```

Example:
```
https://harzahav.online/?utm_source=linkedin&utm_medium=social&utm_campaign=npo-outreach-q2
```

---

## Tracking Notes

- GA4 auto-captures UTM parameters on page load
- All internal links should use clean URLs (no UTMs)
- UTMs are case-sensitive — always use lowercase
- Always test UTM links before sending
- Do not use UTMs on internal navigation

---

## GA4 Custom Events

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `inquiry_submitted` | Contact form / Calendly submitted | `method`, `page_path` |

---

## Owner

- **UTM conventions**: Marketing team (Maya / Ben)
- **GA4 setup**: Ben (Data & Performance)
- **Campaign execution**: Noa (NPO Outreach) + Tal (Content)
