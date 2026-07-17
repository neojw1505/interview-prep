function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

class SearchIndex {
  data() {
    return {
      permalink: "/search-index.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const items = [];
    (data.collections.companies || []).forEach((c) => {
      c.questions.forEach((item) => {
        items.push({
          id: item.data.id,
          title: item.data.title,
          label: item.data.navLabel,
          company: c.meta.name,
          companySlug: c.slug,
          haystack: stripHtml(
            item.data.title + " " + item.data.label + " " + item.templateContent
          ).toLowerCase(),
        });
      });
    });
    return JSON.stringify(items);
  }
}

module.exports = SearchIndex;
