'use client'

import { useState } from 'react'
import { useLegalConfigStore, type DPASubprocessor } from '@/stores/legal-config-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink, Check, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'

const DEFAULT_IDS = ['supabase', 'anthropic', 'stripe', 'vercel']

export default function DPATrackerPage() {
  const { subprocessors, updateSubprocessor, addSubprocessor, removeSubprocessor } = useLegalConfigStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSub, setNewSub] = useState({ name: '', purpose: '', location: '' })

  function handleToggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function handleAddSubprocessor() {
    if (!newSub.name.trim()) {
      toast.error('Name is required')
      return
    }
    const sub: DPASubprocessor = {
      id: `custom_${Date.now()}`,
      name: newSub.name.trim(),
      purpose: newSub.purpose.trim(),
      location: newSub.location.trim(),
      dpaUrl: '',
      dpaSigned: false,
      dpaSignedDate: '',
      notes: '',
    }
    addSubprocessor(sub)
    setNewSub({ name: '', purpose: '', location: '' })
    setShowAddForm(false)
    toast.success(`Added subprocessor: ${sub.name}`)
  }

  function handleRemove(id: string, name: string) {
    removeSubprocessor(id)
    toast.success(`Removed subprocessor: ${name}`)
  }

  const signedCount = subprocessors.filter((s) => s.dpaSigned).length

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">DPA Tracker</h1>
          <p className="text-muted-foreground text-sm">
            Track Data Processing Agreements with all subprocessors
          </p>
        </div>
        <Badge variant={signedCount === subprocessors.length ? 'default' : 'secondary'} className="text-sm">
          {signedCount}/{subprocessors.length} signed
        </Badge>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Subprocessors</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Subprocessor
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {showAddForm && (
            <div className="mb-4 rounded-lg border p-4 space-y-3 bg-muted/30">
              <p className="text-sm font-medium">Add Custom Subprocessor</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="new-name">Name</Label>
                  <Input
                    id="new-name"
                    placeholder="e.g. SendGrid"
                    value={newSub.name}
                    onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-purpose">Purpose</Label>
                  <Input
                    id="new-purpose"
                    placeholder="e.g. Email delivery"
                    value={newSub.purpose}
                    onChange={(e) => setNewSub({ ...newSub, purpose: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-location">Location</Label>
                  <Input
                    id="new-location"
                    placeholder="e.g. USA/EU"
                    value={newSub.location}
                    onChange={(e) => setNewSub({ ...newSub, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddSubprocessor}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {subprocessors.map((sub) => {
            const isExpanded = expandedId === sub.id
            const isDefault = DEFAULT_IDS.includes(sub.id)

            return (
              <div key={sub.id} className="rounded-lg border">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => handleToggleExpand(sub.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge
                      variant={sub.dpaSigned ? 'default' : 'destructive'}
                      className="shrink-0"
                    >
                      {sub.dpaSigned ? (
                        <><Check className="mr-1 h-3 w-3" /> Signed</>
                      ) : (
                        <><X className="mr-1 h-3 w-3" /> Unsigned</>
                      )}
                    </Badge>
                    <div className="min-w-0">
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">{sub.purpose}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground text-xs">{sub.location}</span>
                    {sub.dpaUrl && (
                      <a
                        href={sub.dpaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {sub.dpaSigned && sub.dpaSignedDate && (
                      <span className="text-muted-foreground text-xs">{sub.dpaSignedDate}</span>
                    )}
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center gap-4">
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sub.dpaSigned}
                          onChange={(e) => updateSubprocessor(sub.id, { dpaSigned: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        DPA Signed
                      </Label>
                      <div className="space-y-1">
                        <Label htmlFor={`date-${sub.id}`}>Signed Date</Label>
                        <Input
                          id={`date-${sub.id}`}
                          type="date"
                          value={sub.dpaSignedDate}
                          onChange={(e) => {
                            updateSubprocessor(sub.id, { dpaSignedDate: e.target.value })
                            toast.success(`Updated signed date for ${sub.name}`)
                          }}
                          className="w-44"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`dpa-url-${sub.id}`}>DPA URL</Label>
                      <Input
                        id={`dpa-url-${sub.id}`}
                        type="url"
                        placeholder="https://..."
                        value={sub.dpaUrl}
                        onChange={(e) => updateSubprocessor(sub.id, { dpaUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`notes-${sub.id}`}>Notes</Label>
                      <textarea
                        id={`notes-${sub.id}`}
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Add notes..."
                        value={sub.notes}
                        onChange={(e) => updateSubprocessor(sub.id, { notes: e.target.value })}
                      />
                    </div>
                    {!isDefault && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemove(sub.id, sub.name)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                    {isDefault && (
                      <p className="text-xs text-muted-foreground">
                        Default subprocessor -- cannot be removed.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
