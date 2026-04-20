import { getDynamicPolicies } from '../actions'
import BeleidEditor from './BeleidEditor'

export default async function BeleidEditorPage(props: {
    params: Promise<{ slug: string }>
}) {
    const params = await props.params;
    const isNew = !params?.slug || params.slug === 'new'
    
    let policy = null
    if (!isNew) {
        const policies = await getDynamicPolicies()
        policy = policies.find(p => p.id === params.slug) || null
    }

    return <BeleidEditor initialData={policy} />
}
