import { Box, Card, CardContent, Chip as MuiChip, Grid, Typography } from '@mui/material'
import { RiBarChart2Fill, RiLineChartLine, RiPieChartFill, RiUserSearchLine } from '@remixicon/react'
import { Chip } from '@/components/base/badges/chip'
import { Accordion, AccordionItem } from '@/components/base/accordion/accordion'
import { StatCards } from '@/components/application/dashboard/stat-cards'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@/components/base/table/table'

// Resolve __BASE__ asset paths against Vite's base (./ on GitHub Pages).
export const asset = (src) => (src || '').replace('__BASE__', import.meta.env.BASE_URL)

function Html({ html, ...props }) {
  return <Box {...props} dangerouslySetInnerHTML={{ __html: html }} />
}

function Figure({ fig }) {
  if (!fig || !fig.src) return null
  return (
    <Box component="figure" sx={{ my: 3 }}>
      <Box component="img" src={asset(fig.src)} alt={fig.alt || ''} sx={{ borderRadius: 2, width: '100%' }} />
      {fig.caption ? <Typography component="figcaption" variant="caption" color="text.secondary" sx={{ mt: 1 }}>{fig.caption}</Typography> : null}
    </Box>
  )
}

const STAT_ICONS = [RiBarChart2Fill, RiLineChartLine, RiPieChartFill, RiUserSearchLine]

export function renderBlocks(blocks, keyPrefix = 'b') {
  return blocks.map((b, i) => {
    const key = `${keyPrefix}-${i}`
    switch (b.type) {
      case 'heading': {
        const variant = b.level === 1 ? 'h4' : b.level === 2 ? 'h5' : b.level === 3 ? 'h6' : 'subtitle1'
        return <Typography key={key} variant={variant} component={`h${Math.min(b.level + 1, 6)}`} sx={{ mt: 4, mb: 2 }}>{b.text}</Typography>
      }
      case 'paragraph':
        return <Html key={key} component="p" html={b.html} />
      case 'lede':
        return <Html key={key} component="p" html={b.html} sx={{ fontSize: 20, color: 'text.primary' }} />
      case 'pullquote':
        return <Typography key={key} className="pullquote" component="p">{b.text}</Typography>
      case 'list':
        return (
          <Box key={key} component={b.ordered ? 'ol' : 'ul'} sx={{ pl: '1.4em', mb: 2 }}>
            {b.items.map((item, j) => <Html key={j} component="li" html={item} sx={{ mb: 0.5 }} />)}
          </Box>
        )
      case 'figure':
        return <Figure key={key} fig={b} />
      case 'quote':
        return <Html key={key} component="blockquote" html={b.html} />
      case 'testimonial':
        return <Html key={key} className="testimonial" html={b.html} />
      case 'glance':
        // BoardUI Table (react-aria) for the At-a-Glance key/value rows.
        return (
          <Box key={key} sx={{ my: 3 }}>
            <Table size="sm" aria-label="At a glance">
              <TableHeader>
                <TableColumn isRowHeader>Item</TableColumn>
                <TableColumn>Detail</TableColumn>
              </TableHeader>
              <TableBody>
                {b.rows.map((row, j) => (
                  <TableRow key={j}>
                    <TableCell><strong>{row.label}</strong></TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )
      case 'steps':
        return (
          <Box key={key} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 3 }}>
            {b.steps.map((s, j) => (
              <MuiChip key={j} label={`${j + 1}. ${s}`} variant="outlined" sx={{ fontWeight: 700 }} />
            ))}
          </Box>
        )
      case 'stats':
        // BoardUI StatCards — only the impact numbers the site itself states.
        return (
          <Box key={key} sx={{ my: 3 }}>
            <StatCards
              stats={b.stats.map((s, j) => ({
                icon: STAT_ICONS[j % STAT_ICONS.length],
                label: s.label,
                value: s.value,
                delta: 'Impact',
                deltaColor: 'neutral',
              }))}
            />
          </Box>
        )
      case 'cards':
        return (
          <Grid key={key} container spacing={2} sx={{ my: 3 }}>
            {b.cards.map((card, j) => (
              <Grid key={j} size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    {card.figure ? <Figure fig={card.figure} /> : null}
                    {card.paras.map((p, k) => <Html key={k} component="p" html={p} />)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      case 'twocol':
        return (
          <Grid key={key} container spacing={4} sx={{ my: 3, alignItems: 'start' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              {b.figures.map((f, j) => <Figure key={j} fig={f} />)}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>{renderBlocks(b.content, `${key}-c`)}</Grid>
          </Grid>
        )
      case 'gallery':
        return (
          <Grid key={key} container spacing={2} sx={{ my: 3 }}>
            {b.figures.map((f, j) => (
              <Grid key={j} size={{ xs: 12, sm: 6, md: 4 }}><Figure fig={f} /></Grid>
            ))}
          </Grid>
        )
      case 'accordion':
        return (
          <Box key={key} sx={{ my: 3 }}>
            <Accordion variant="separated">
              <AccordionItem id={`${key}-item`} title={b.title}>
                {renderBlocks(b.blocks, `${key}-a`)}
              </AccordionItem>
            </Accordion>
          </Box>
        )
      default:
        return null
    }
  })
}

// BoardUI Chip for the method tags on project cards / case hero.
export function TagChips({ tags }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {tags.map((t) => <Chip key={t} variant="caption" color="soft">{t}</Chip>)}
    </Box>
  )
}
