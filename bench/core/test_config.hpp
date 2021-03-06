#pragma once

#include <chrono>
#include <string>

namespace bench
{

struct test_config
{
    std::string cluster_uri;
    std::size_t content_size;
    bool no_cleanup;
    int thread_count;
    std::chrono::seconds duration;
};

} // namespace bench
