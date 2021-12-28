import medium from 'medium-sdk'
import assert from 'assert'
import open from 'open'
import { PostContent } from '../blogger'

// publish a markdown file to medium
function main(options: PostContent, token: string) {

    assert.equal(typeof token, 'string', 'markdown-to-medium: token should be a string')

    const client = new medium.MediumClient({
        clientId: token,
        clientSecret: token
    })

    client.setAccessToken(token)

    let content = `
    # ${options.title}
    ${options.body}
    `

    if (options.canonicalUrl.length) {
        content += `
*Posted from [${options.canonicalUrl}](${options.canonicalUrl}).*
    `
    }

    client.getUser((err, user) => {
        if (err) {
            throw new Error(err)
        }

        console.log(`Authenticated as ${user.username}`)

        const clientOptions = {
            userId: user.id,
            title: options.title,
            tags: options.tags,
            content,
            canonicalUrl: options.canonicalUrl,
            license: "all-rights-reserved", 
            contentFormat: 'markdown',
            publishStatus: 'draft'
        }

        const successMsg = `Draft post "${options.title}" published to Medium.com`

        if (options.publication) {
            client.getPublicationsForUser({ userId: user.id }, (err, publications) => {
                if (err) {
                    throw new Error(err)
                }
                const myPub = publications.filter((val) => { return val.name === options.publication })
                if (myPub.length === 0) {
                    throw new Error('No publication by that name!')
                }
                client.createPostInPublication(Object.assign(clientOptions, { publicationId: myPub[0].id }), (err, post) => {
                    if (err) {
                        throw new Error(err)
                    }
                    console.log(successMsg)
                    open(post.url)
                })
            })
        } else {
            client.createPost(clientOptions, (err, post) => {
                if (err) {
                    throw new Error(err)
                }
                console.log(successMsg)
                open(post.url)
            })
        }
    })
}