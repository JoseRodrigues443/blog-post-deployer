import fs from 'fs'
import frontMatter from 'front-matter'

export interface Config {
    source: string
}

export interface PostContent {
    title: string;
    tags: string;
    body: string;
    canonicalUrl: string;
    publication: string;
}

const readFile = (filename: string): PostContent  => {
    let src: string
    try {
        src = fs.readFileSync(filename, 'utf8')
    } catch (e) {
        throw new Error('Could not read file ' + filename)
    }

    // TODO make frontMatter work
    const matter = frontMatter(src)
    const title = "matter.attributes.title"
    const tags = "matter.attributes.tags"
    const body = matter.body;
    const canonicalUrl = "https://joserodrigues443.github.io/#posts"
    const publication = "matter.attributes.publication"
    return {
        title: title,
        tags: tags,
        body: body,
        canonicalUrl: canonicalUrl,
        publication: publication
    }
}

