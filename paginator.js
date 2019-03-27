function index(env, callback) {
    
    const defaults = {
        template: 'index.pug', // template that renders pages
        articles: 'articles', // directory containing contents to paginate
        first: 'index.html', // filename/url for first page
        filename: 'page/%d/index.html', // filename for rest of pages
        perPage: 2 // number of articles per page
    };

    // assign defaults any option not set in the config file
    const options = env.config.paginator || {};
    for (const key in defaults) {
        if (options[key] == null) {
            options[key] = defaults[key];
        }
    }

    const getArticles = function (contents) {
        // helper that returns a list of articles found in *contents*
        // note that each article is assumed to have its own directory in the articles directory
        let articles = contents[options.articles]._.directories.map(item => item.index);
        // skip articles that does not have a template associated
        articles = articles.filter(item => item.template !== 'none');
        // sort article by date
        articles.sort((a, b) => b.date - a.date);
        return articles;
    };

    class PaginatorPage extends env.plugins.Page {

        constructor(pageNum, articles, pageCount) {
            super();
            this.pageNum = pageNum;
            this.articles = articles;
            this.pageCount = pageCount;
        }

        getFilename() {
            return this.pageNum === 1 ?
                options.first :
                options.filename.replace('%d', this.pageNum);
        }

        getView() {
            return function (env, locals, contents, templates, callback) {
                // simple view to pass articles and pagenum to the paginator template
                // note that this function returns a funciton

                // get the pagination template
                const template = templates[options.template];
                if ((template == null)) {
                    return callback(new Error(`unknown paginator template '${ options.template }'`));
                }
                
                // setup the template context
                const ctx = {
                    articles: this.articles,
                    pageNum: this.pageNum,
                    prevPage: this.prevPage,
                    nextPage: this.nextPage,
                    pageCount: this.pageCount
                };

                // extend the template context with the enviroment locals
                env.utils.extend(ctx, locals);

                // finally render the template
                return template.render(ctx, callback);
            }
        }
    }

    env.registerGenerator('paginator', function (contents, callback) {

        // find all articles
        const articles = getArticles(contents);

        // populate pages
        const numPages = Math.ceil(articles.length / options.perPage);
        const pages = [];

        for (let i = 0; i < numPages; i++) {
            const pageArticles = articles.slice(i * options.perPage, (i + 1) * options.perPage);
            pages.push(new PaginatorPage(i + 1, pageArticles, numPages));
        }

        // add references to prev/next to each page
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            page.prevPage = pages[i - 1];
            page.nextPage = pages[i + 1];
        }

        // create the object that will be merged with the content tree (contents)
        // do _not_ modify the tree directly inside a generator, consider it read-only
        const data = {
            pages: {}
        };

        for (const page of Array.from(pages)) {
            data.pages[`${ page.pageNum }.page`] = page;
        } 
        
        // file extension is arbitrary
        data['index.page'] = pages[0]; // alias for first page
        data['last.page'] = pages[(numPages - 1)]; // alias for last page

        // callback with the generated contents
        return callback(null, data);
    });

    // add the article helper to the environment so we can use it later
    env.helpers.getArticles = getArticles;

    callback();
}

module.exports = index;