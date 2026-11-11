import { useEffect, useMemo, useState } from 'react'
import {
  Box, Button, Card, CardContent, CardMedia, Container, Grid, Link as MuiLink,
  Stack, Typography,
} from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { RiFileListLine, RiGlobeLine, RiGroupLine, RiUserSearchLine } from '@remixicon/react'
import { Breadcrumb, BreadcrumbItem } from '@/components/base/breadcrumb/breadcrumb'
import { StatCards } from '@/components/application/dashboard/stat-cards'
import { Tabs, Tab, TabList, TabPanel } from '@/components/base/tabs/tabs'
import { content } from './data/content.js'
import { asset, renderBlocks, TagChips } from './components/CaseBlocks.jsx'
import DotGrid from './components/DotGrid.jsx'
import ContactForm from './components/ContactForm.jsx'

const { home, about, projects, order } = content
const SERVICENOW = order.slice(0, 4) // Migration, Legacy, AI Processing, Rolling Research
const RELTIO = order.slice(4) // Bulk Actions, Data Validation (internship)

function routeFromHash() {
  const h = window.location.hash.replace(/^#\/?/, '')
  if (!h) return { page: 'home' }
  if (h === 'about') return { page: 'about' }
  if (h === 'contact') return { page: 'contact' }
  const m = h.match(/^projects\/([\w-]+)$/)
  if (m && projects[m[1]]) return { page: 'project', slug: m[1] }
  return { page: 'home' }
}
const go = (hash) => { window.location.hash = hash }

function Marquee() {
  const tools = [...about.tools, ...about.tools]
  return (
    <Box component="footer" className="marquee" aria-label="Research tools">
      <Box className="marquee-track">{tools.map((t, i) => <span key={i}>{t}</span>)}</Box>
    </Box>
  )
}

function Nav({ page }) {
  const item = (label, hash, active) => (
    <Button key={label} onClick={() => go(hash)} sx={{ color: active ? 'text.primary' : 'text.secondary', fontWeight: active ? 700 : 400, px: 1.5 }}>
      {label}
    </Button>
  )
  return (
    <Box sx={{ position: 'sticky', top: 18, zIndex: 50, display: 'flex', justifyContent: 'center', px: 2, pointerEvents: 'none' }}>
      <Box sx={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(241,241,241,0.92)', border: 1, borderColor: 'divider', borderRadius: 999, px: 2, py: 1, backdropFilter: 'blur(8px)', boxShadow: 2 }}>
        {item('Work', '/', page === 'home' || page === 'project')}
        {item('About', '/about', page === 'about')}
        {item('Contact', '/contact', page === 'contact')}
        <Button href={asset(content.resume)} target="_blank" rel="noopener" sx={{ color: 'text.secondary', px: 1.5 }}>Resumé</Button>
        <Button href={content.linkedin} target="_blank" rel="noopener" sx={{ color: 'text.secondary', px: 1.5 }}>Linkedin</Button>
      </Box>
    </Box>
  )
}

function ProjectCard({ slug, flip }) {
  const p = home.projects.find((x) => x.slug === slug)
  const proj = projects[slug]
  if (!p) return null
  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', md: flip ? 'row-reverse' : 'row' }, alignItems: 'center', gap: 4, p: { xs: 2, md: 4 }, mb: 5 }}>
      <CardContent sx={{ flex: 1 }}>
        <TagChips tags={p.tags} />
        <Typography variant="h4" component="h2" sx={{ mb: 1.5 }}>
          <MuiLink onClick={() => go(`/projects/${slug}`)} underline="hover" sx={{ cursor: 'pointer', color: 'text.primary' }}>{p.title}</MuiLink>
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2.5 }}>{p.sub}</Typography>
        <Button variant="outlined" onClick={() => go(`/projects/${slug}`)}>View project</Button>
      </CardContent>
      <CardMedia component="img" image={asset(p.image)} alt={p.imageAlt}
        sx={{ width: { xs: '100%', md: '50%' }, aspectRatio: '16/10', objectFit: 'cover', borderRadius: 2, cursor: 'pointer' }}
        onClick={() => go(`/projects/${slug}`)} />
      <Box sx={{ display: 'none' }}>{proj ? '' : ''}</Box>
    </Card>
  )
}

function HomePage() {
  const [filter, setFilter] = useState('all')
  const groups = useMemo(() => ({ all: order, servicenow: SERVICENOW, reltio: RELTIO }), [])
  const panel = (key) => (
    <Box sx={{ mt: 3 }}>
      {groups[key].map((slug, i) => <ProjectCard key={slug} slug={slug} flip={i % 2 === 1} />)}
    </Box>
  )
  return (
    <>
      <Box className="dotgrid-wrap" sx={{ py: { xs: 6, md: 9 } }}>
        <DotGrid />
        <Container maxWidth="lg" className="dotgrid-content">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h1" sx={{ fontSize: { xs: 44, md: 72 } }}>{home.name}</Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: 44, md: 72 }, fontWeight: 400, mb: 3 }}>{home.role}</Typography>
              {home.intro.map((p, i) => <Typography key={i} sx={{ mb: 1.5, fontSize: 20 }}>{p}</Typography>)}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" startIcon={<LinkedInIcon />} href={content.linkedin} target="_blank" rel="noopener">LinkedIn</Button>
                <Button variant="outlined" href={asset(content.resume)} target="_blank" rel="noopener">Resumé</Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box component="img" src={asset(home.portrait)} alt={home.portraitAlt} sx={{ borderRadius: 3, width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* BoardUI StatCards — at a glance, every number from the site itself */}
        <StatCards
          variant="footer"
          stats={[
            { icon: RiUserSearchLine, label: 'UX research experience', value: '5+ years', delta: 'Enterprise B2B', deltaColor: 'neutral', tone: 'blue', caption: 'ServiceNow' },
            { icon: RiFileListLine, label: 'Case studies', value: '6', delta: 'On this site', deltaColor: 'neutral', tone: 'orange', caption: '6 projects' },
            { icon: RiGroupLine, label: 'Customer orgs, legacy field study', value: '9', delta: '6-month study', deltaColor: 'neutral', tone: 'purple', caption: 'On-site + remote' },
            { icon: RiGlobeLine, label: 'Countries travelled', value: '20+', delta: '3 lived in', deltaColor: 'neutral', tone: 'emerald', caption: 'Psychology + HCI' },
          ]}
        />

        <Typography variant="h2" sx={{ mt: 7, mb: 1 }}>Selected work</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Four ServiceNow platform studies and two Reltio internship studies.</Typography>
        {/* BoardUI Tabs — filter the work by where it was done */}
        <Tabs selectedKey={filter} onSelectionChange={(k) => setFilter(String(k))}>
          <TabList aria-label="Filter work">
            <Tab id="all">All · {order.length}</Tab>
            <Tab id="servicenow">ServiceNow · {SERVICENOW.length}</Tab>
            <Tab id="reltio">Reltio · {RELTIO.length}</Tab>
          </TabList>
          <TabPanel id="all">{panel('all')}</TabPanel>
          <TabPanel id="servicenow">{panel('servicenow')}</TabPanel>
          <TabPanel id="reltio">{panel('reltio')}</TabPanel>
        </Tabs>

        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h2" sx={{ mb: 1.5 }}>Get in touch!</Typography>
          <Typography sx={{ fontSize: 20, maxWidth: 640, mx: 'auto', mb: 4 }}>
            Do you have a product idea, want to discuss a project, or need a researcher? Drop me an email!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><ContactForm /></Box>
        </Box>
      </Container>
      <Marquee />
    </>
  )
}

function AboutPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="start">
          <Grid size={{ xs: 12, md: 5 }}>
            <Box component="img" src={asset(home.portrait)} alt={home.portraitAlt} sx={{ borderRadius: 3, width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 52 }, mb: 3 }}>{about.heading}</Typography>
            {about.paras.map((p, i) => <Typography key={i} sx={{ mb: 2 }}>{p}</Typography>)}
            <Button variant="contained" startIcon={<LinkedInIcon />} href={content.linkedin} target="_blank" rel="noopener" sx={{ mt: 1 }}>LinkedIn</Button>
          </Grid>
        </Grid>
      </Container>
      <Marquee />
    </>
  )
}

function ContactPage() {
  return (
    <>
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 52 }, mb: 2 }}>Dear Sagarika Kanchibail,</Typography>
        <Typography sx={{ fontSize: 20, color: 'text.primary', mb: 3 }}>Email</Typography>
        <ContactForm />
      </Container>
      <Marquee />
    </>
  )
}

function ProjectPage({ slug }) {
  const proj = projects[slug]
  const idx = order.indexOf(slug)
  const prev = idx > 0 ? order[idx - 1] : null
  const next = idx < order.length - 1 ? order[idx + 1] : null
  const card = home.projects.find((x) => x.slug === slug)
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
      <Breadcrumb>
        <BreadcrumbItem onClick={() => go('/')}>Work</BreadcrumbItem>
        <BreadcrumbItem current>{proj.title}</BreadcrumbItem>
      </Breadcrumb>
      <Typography variant="overline" sx={{ letterSpacing: '0.06em', mt: 3, display: 'block' }}>{proj.byline}</Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 52 }, mt: 1, mb: 3 }}>{proj.title}</Typography>
      {card ? <TagChips tags={card.tags} /> : null}
      {proj.heroFigure ? (
        <Box component="img" src={asset(proj.heroFigure.src)} alt={proj.heroFigure.alt || ''} sx={{ borderRadius: 2, width: '100%', mb: 3 }} />
      ) : null}
      {proj.pullquote ? <Typography className="pullquote" component="p">{proj.pullquote}</Typography> : null}
      {proj.lede ? <Typography sx={{ fontSize: 20, color: 'text.primary', mb: 2 }}>{proj.lede}</Typography> : null}
      <Box className="case-body">{renderBlocks(proj.blocks, slug)}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, borderTop: 1, borderColor: 'divider', pt: 4, mt: 6, pb: 4 }}>
        {prev ? (
          <Button onClick={() => go(`/projects/${prev}`)}>← Previous project<br />{projects[prev].title}</Button>
        ) : <span />}
        {next ? (
          <Button onClick={() => go(`/projects/${next}`)} sx={{ textAlign: 'right' }}>Next project →<br />{projects[next].title}</Button>
        ) : <span />}
      </Box>
    </Container>
  )
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  useEffect(() => {
    const onHash = () => { setRoute(routeFromHash()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Nav page={route.page} />
      {route.page === 'home' && <HomePage />}
      {route.page === 'about' && <AboutPage />}
      {route.page === 'contact' && <ContactPage />}
      {route.page === 'project' && <ProjectPage slug={route.slug} />}
      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">© Sagarika Kanchibail · <MuiLink onClick={() => go('/contact')} sx={{ cursor: 'pointer' }}>Contact</MuiLink> · <MuiLink href={content.linkedin} target="_blank" rel="noopener">LinkedIn</MuiLink></Typography>
      </Box>
    </Box>
  )
}
