class FeatureApi {
  constructor(queries, databaseQuery) {
    this.queries = queries;
    this.databaseQuery = databaseQuery;
  }

  filter() {
    let query = { ...this.queries };
    let arr = ["sort", "page", "limit", "field"];
    query = JSON.stringify(query);
    arr.forEach((val) => {
      delete query[val];
    });

    query = query.replace(/\bgte|gt|lt|lte\b/g, (val) => `$${val}`);

    const queriesObj = JSON.parse(query);

    this.databaseQuery = this.databaseQuery.find(queriesObj);
    return this;
  }
  sort() {
    if (this.queries.sort) {
      let sort = this.queries.sort.split(",").join(" ");
      this.databaseQuery = this.databaseQuery.sort(sort);
    } else {
      this.databaseQuery = this.databaseQuery.sort("-createdAt");
    }

    return this;
  }
  field() {
    if (this.queries.field) {
      let field = this.queries.field.split(",").join(" ");
      this.databaseQuery = this.databaseQuery.select(field);
    } else {
      this.databaseQuery = this.databaseQuery.select("-__v");
    }
    return this;
  }

  pagenation() {
    let page = this.queries.page || 1;
    let limit = this.queries.limit || 3;
    let skip = (page - 1) * limit;
    this.databaseQuery = this.databaseQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = FeatureApi;
