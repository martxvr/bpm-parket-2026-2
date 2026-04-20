import { getDynamicPolicies } from './actions'
import BeleidClient from './BeleidClient'

export default async function BeleidPage() {
    const policies = await getDynamicPolicies()

    return <BeleidClient initialPolicies={policies} />
}
